'use client';
import { createContext, useContext, useEffect, useReducer, useState } from 'react';

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;

    case 'ADD_ITEM':
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];

    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.payload);

    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isHydrated, setIsHydrated] = useState(false);

  // ✅ Only one useEffect — to load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      dispatch({ type: 'SET_CART', payload: JSON.parse(stored) });
    }
    setIsHydrated(true);
  }, []);

  // ✅ Save to localStorage when cart changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  if (!isHydrated) return null;

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
