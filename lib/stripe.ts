// Minimal Stripe REST client. Uses plain fetch so the project needs no extra dependency.
// Server-only: reads STRIPE_SECRET_KEY, which must never reach the browser.

type Param = string | number | boolean | null | undefined | Param[] | { [key: string]: Param }

const API_BASE = process.env.STRIPE_API_BASE ?? 'https://api.stripe.com'

export class StripeError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'StripeError'
    this.status = status
  }
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

// Stripe expects form encoding with bracket notation: a[b][0][c]=value
export function encodeParams(params: Record<string, Param>): string {
  const pairs: [string, string][] = []
  const walk = (prefix: string, value: Param) => {
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(`${prefix}[${index}]`, item))
    } else if (typeof value === 'object') {
      for (const [key, inner] of Object.entries(value)) walk(`${prefix}[${key}]`, inner)
    } else {
      pairs.push([prefix, String(value)])
    }
  }
  for (const [key, value] of Object.entries(params)) walk(key, value)
  return new URLSearchParams(pairs).toString()
}

export async function stripeRequest<T = Record<string, any>>(
  method: 'GET' | 'POST',
  path: string,
  params: Record<string, Param> = {},
  options: { idempotencyKey?: string } = {},
): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new StripeError('Stripe is not configured', 503)

  const body = encodeParams(params)
  const url = method === 'GET' && body ? `${API_BASE}${path}?${body}` : `${API_BASE}${path}`
  const headers: Record<string, string> = { Authorization: `Bearer ${key}` }
  if (method === 'POST') headers['Content-Type'] = 'application/x-www-form-urlencoded'
  if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey

  const response = await fetch(url, {
    method,
    headers,
    body: method === 'POST' ? body : undefined,
    cache: 'no-store',
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new StripeError(data?.error?.message ?? `Stripe request failed (${response.status})`, response.status)
  }
  return data as T
}
