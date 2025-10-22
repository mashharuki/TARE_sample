import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity, size, color) => {
        const { items } = get();
        const existingItem = items.find(
          item => item.product_id === product.id && 
                  item.size === size && 
                  item.color === color
        );
        
        if (existingItem) {
          // 既存のアイテムがある場合は数量を増やす
          set({
            items: items.map(item =>
              item.product_id === product.id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          // 新しいアイテムを追加
          const newItem: CartItem = {
            id: `${product.id}-${size}-${color}-${Date.now()}`,
            product_id: product.id,
            product: product,
            quantity: quantity,
            size: size,
            color: color,
            added_at: new Date().toISOString()
          };
          
          set({ items: [...items, newItem] });
        }
      },
      
      removeItem: (productId, size, color) => {
        const { items } = get();
        set({
          items: items.filter(
            item => !(item.product_id === productId && item.size === size && item.color === color)
          )
        });
      },
      
      updateQuantity: (productId, size, color, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          // 数量が0以下の場合はアイテムを削除
          get().removeItem(productId, size, color);
        } else {
          set({
            items: items.map(item =>
              item.product_id === productId && item.size === size && item.color === color
                ? { ...item, quantity: quantity }
                : item
            )
          });
        }
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
);