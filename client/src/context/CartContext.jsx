import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_canteen_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('smart_canteen_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (food, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.foodId === food.id || item.foodId === food.foodId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        updated[existingIdx].subtotal = updated[existingIdx].quantity * updated[existingIdx].price;
        return updated;
      } else {
        return [
          ...prev,
          {
            foodId: food.id || food.foodId,
            name: food.name,
            price: food.price,
            image: food.image,
            category: food.category,
            quantity,
            subtotal: food.price * quantity
          }
        ];
      }
    });
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.foodId === foodId
          ? {
              ...item,
              quantity,
              subtotal: item.price * quantity
            }
          : item
      )
    );
  };

  const removeFromCart = (foodId) => {
    setCart((prev) => prev.filter((item) => item.foodId !== foodId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
