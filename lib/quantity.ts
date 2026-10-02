import { useCallback, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'

// Quantity stepping for the product card and modal counters.
// + counts by 1 up to 6, then by 6 from there (6, 12, 18, ...). - steps down by 1,
// and a quick double tap on - takes the quantity 6 down from where the first tap started.
// 999 matches the cap the cart and checkout already enforce.
export const MAX_COUNTER_QUANTITY = 999
export const DOUBLE_TAP_MS = 350

export function nextQuantity(q: number): number {
  const next = q < 6 ? q + 1 : q + 6
  return Math.min(next, MAX_COUNTER_QUANTITY)
}

export function prevQuantity(q: number): number {
  return Math.max(1, q - 1)
}

// Returns the minus-button handler. A single tap steps down by 1 immediately. If a second tap
// lands within DOUBLE_TAP_MS, the result is (quantity before the first tap) - 6, floored at 1.
export function useMinusStep(quantity: number, setQuantity: Dispatch<SetStateAction<number>>) {
  const lastTap = useRef(0)
  const startQuantity = useRef<number | null>(null)

  return useCallback(() => {
    const now = Date.now()
    if (startQuantity.current !== null && now - lastTap.current < DOUBLE_TAP_MS) {
      const start = startQuantity.current
      startQuantity.current = null
      lastTap.current = 0
      setQuantity(Math.max(1, start - 6))
      return
    }
    lastTap.current = now
    startQuantity.current = quantity
    setQuantity(prevQuantity(quantity))
  }, [quantity, setQuantity])
}
