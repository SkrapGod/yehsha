'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart-context'

export function FloatingCart() {
  const { itemCount, openCart } = useCart()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const store = document.getElementById('store')
      setVisible(!!store && store.getBoundingClientRect().top <= 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={openCart}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label={`Open cart, ${itemCount} items`}
      className={`fixed top-[max(1rem,env(safe-area-inset-top))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white bg-black text-white shadow-lg transition-all duration-300 md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
      }`}
    >
      <ShoppingBag className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-black px-1 font-mono text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </button>
  )
}
