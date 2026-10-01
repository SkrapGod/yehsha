import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { checkPostalCode } from '@/lib/postal-check'

export const runtime = 'nodejs'

const TOLERANCE_SECONDS = 300

// Verifies Stripe's signature header (t=timestamp,v1=hmac) against the raw request body.
function verifySignature(rawBody: string, header: string | null, secret: string) {
  if (!header) return false
  const parts = header.split(',').map((part) => part.split('=') as [string, string])
  const timestamp = parts.find(([key]) => key === 't')?.[1]
  const signatures = parts.filter(([key]) => key === 'v1').map(([, value]) => value)
  if (!timestamp || signatures.length === 0) return false

  const age = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false

  const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex')
  const expectedBuffer = Buffer.from(expected)
  return signatures.some((signature) => {
    const buffer = Buffer.from(signature)
    return buffer.length === expectedBuffer.length && timingSafeEqual(buffer, expectedBuffer)
  })
}

// After payment, re-check the delivery address Stripe collected. The postal code checked in
// the cart can differ from the address typed on Stripe's page, so this is the second half
// of the delivery gate.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const rawBody = await request.text()
  if (!verifySignature(rawBody, request.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: { type?: string; data?: { object?: Record<string, any> } }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data?.object ?? {}
    const address =
      session.shipping_details?.address ?? session.collected_information?.shipping_details?.address
    const result = checkPostalCode(typeof address?.postal_code === 'string' ? address.postal_code : '')

    if (!result.deliverable) {
      // No automatic refund: money movement needs an owner decision. Search the logs for this tag.
      console.error(
        `[stripe-webhook] UNDELIVERABLE ORDER paid: session ${session.id}, payment_intent ${session.payment_intent}, ` +
          `shipping postal "${address?.postal_code ?? 'none'}" (${result.reason}), cart-checked "${session.metadata?.postal_code ?? 'none'}"`,
      )
    }
  }

  return NextResponse.json({ received: true })
}
