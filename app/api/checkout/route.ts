import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { products } from '@/lib/products'
import { computeOrder, toCents, type PricedLine } from '@/lib/pricing'
import { checkPostalCode } from '@/lib/postal-check'
import { isStripeConfigured, stripeRequest, StripeError } from '@/lib/stripe'

export const runtime = 'nodejs'

const MAX_LINES = 20
const MAX_QUANTITY = 999

const fail = (error: string, status: number) => NextResponse.json({ error }, { status })

// Creates a Stripe Checkout Session. Nothing the browser sends is trusted: prices and
// totals are recomputed here from the product list, and the postal code is re-checked,
// so the client-side button gate can't be bypassed to start a payment.
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return fail('Invalid request.', 400)
  }

  const { items, postalCode } = (body ?? {}) as { items?: unknown; postalCode?: unknown }

  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
    return fail('Your cart is empty.', 400)
  }

  const lines: PricedLine[] = []
  for (const item of items) {
    const product = products.find((p) => p.id === item?.id)
    const quantity = item?.quantity
    if (
      !product ||
      product.available === false ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QUANTITY ||
      lines.some((line) => line.product.id === product.id)
    ) {
      return fail('Something in your cart is no longer available. Please review your cart.', 400)
    }
    lines.push({ product, quantity })
  }

  const postal = checkPostalCode(typeof postalCode === 'string' ? postalCode : '')
  if (!postal.deliverable) {
    return fail(postal.message, 403)
  }

  if (!isStripeConfigured()) {
    console.error('[checkout] STRIPE_SECRET_KEY is not set')
    return fail('Checkout is not available right now. Please try again shortly.', 503)
  }

  const order = computeOrder(lines)
  const expectedTotal = toCents(order.total)
  // A blank or malformed NEXT_PUBLIC_SITE_URL counts as unset: fall back to the request's own address.
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  let origin = new URL(request.url).origin
  if (configuredOrigin) {
    try {
      origin = new URL(configuredOrigin).origin
    } catch {
      console.error('[checkout] NEXT_PUBLIC_SITE_URL is not a valid URL, ignoring it')
    }
  }
  const publicImages = origin.startsWith('https://')

  try {
    // Stripe does no tax maths here. HST is sent as its own line with the exact cents the cart
    // shows, because Stripe rounds tax per line item and could land a cent away from the cart.
    // The coupon only ever subtracts amount_off from the sum, so the total always equals the cart's.
    const lineItems: Record<string, unknown>[] = lines.map(({ product, quantity }) => ({
      quantity,
      price_data: {
        currency: 'cad',
        unit_amount: toCents(product.price),
        product_data: {
          name: `${product.name} ${product.flavor.replace(/\s+/g, ' ')} (${product.packSize ?? 1}-pack)`,
          images: publicImages ? [`${origin}${product.image}`] : undefined,
        },
      },
    }))

    if (order.delivery > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'cad',
          unit_amount: toCents(order.delivery),
          product_data: { name: 'Local delivery' },
        },
      })
    }

    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'cad',
        unit_amount: toCents(order.hst),
        product_data: { name: 'HST (13%)' },
      },
    })

    let discounts: { coupon: string }[] | undefined
    if (order.bulkDiscount > 0) {
      const coupon = await stripeRequest<{ id: string }>(
        'POST',
        '/v1/coupons',
        {
          name: order.bulkDiscountLabel ?? 'Bulk discount',
          amount_off: toCents(order.bulkDiscount),
          currency: 'cad',
          duration: 'once',
          max_redemptions: 1,
        },
        { idempotencyKey: randomUUID() },
      )
      discounts = [{ coupon: coupon.id }]
    }

    const metadata = {
      postal_code: postal.postalCode,
      cart: lines.map((line) => `${line.product.id}:${line.quantity}`).join(','),
    }

    const session = await stripeRequest<{ id: string; url: string; amount_total: number | null }>(
      'POST',
      '/v1/checkout/sessions',
      {
        mode: 'payment',
        line_items: lineItems as never,
        discounts,
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?checkout=cancelled`,
        shipping_address_collection: { allowed_countries: ['CA'] },
        phone_number_collection: { enabled: true },
        custom_text: {
          shipping_address: { message: 'We deliver only within our local delivery zone.' },
        },
        metadata,
        payment_intent_data: { metadata, description: 'YEHSHA order' },
      },
      { idempotencyKey: randomUUID() },
    )

    if (session.amount_total !== null && session.amount_total !== expectedTotal) {
      // Should never happen now that HST is an explicit line; logged loudly in case it does.
      console.error(
        `[checkout] total mismatch: cart ${expectedTotal} vs Stripe ${session.amount_total} (session ${session.id})`,
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[checkout] failed to create session:', error instanceof StripeError ? error.message : error)
    return fail('We couldn’t start checkout. Please try again.', 502)
  }
}
