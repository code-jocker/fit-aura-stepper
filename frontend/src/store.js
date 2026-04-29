import { create } from 'zustand';

export const useStore = create((set) => ({
  // Auth
  user: null,
  token: localStorage.getItem('token') || null,
  
  // Cart
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
  
  // Auth Actions
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
  
  // Cart Actions
  addToCart: (item) => set((state) => {
    const existingItem = state.cart.find(
      i => i.productId === item.productId && i.size === item.size && i.color === item.color
    );
    
    let newCart;
    if (existingItem) {
      newCart = state.cart.map(i =>
        i === existingItem ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    } else {
      newCart = [...state.cart, item];
    }
    
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  
  removeFromCart: (productId, size) => set((state) => {
    const newCart = state.cart.filter(item => !(item.productId === productId && item.size === size));
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  
  updateCartItem: (productId, quantity, size) => set((state) => {
    const newCart = state.cart.map(item =>
      (item.productId === productId && item.size === size) ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  
  clearCart: () => {
    localStorage.removeItem('cart');
    set({ cart: [] });
  }
}));
