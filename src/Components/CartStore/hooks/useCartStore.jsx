import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: product => {
        const { cart } = get()
        const existingProduct = cart.find(item => item.id === product.id)

        if (existingProduct) {
          set({
            cart: cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] })
        }
      },

      removeFromCart: productId => {
        set({ cart: get().cart.filter(item => item.id !== productId) })
      },

      increaseQuantity: productId => {
        set({
          cart: get().cart.map(item =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        })
      },

      decreaseQuantity: productId => {
        const { cart } = get()
        const existingProduct = cart.find(item => item.id === productId)

        if (existingProduct.quantity > 1) {
          set({
            cart: cart.map(item =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          })
        } else {
          set({ cart: cart.filter(item => item.id !== productId) })
        }
      },

      clearCart: () => set({ cart: [] })
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage
    }
  )
)
