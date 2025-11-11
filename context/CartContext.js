// context/CartContext.js
import React, { createContext, useState, useMemo, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Agregar producto al carrito
  const addToCart = (producto) => {
    setCartItems((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        // Si ya existe, aumentar cantidad
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      // Si no existe, agregar nuevo producto
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // ✅ Eliminar producto
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Cambiar cantidad
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
          : item
      )
    );
  };

  // ✅ Subtotal y total
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [cartItems]
  );

  const total = useMemo(() => subtotal, [subtotal]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Hook personalizado para usar el contexto en cualquier pantalla
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
