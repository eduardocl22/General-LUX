// context/MenuContext.js
import React, { createContext, useState, useContext } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
  return useContext(MenuContext);
};

export const MenuProvider = ({ children }) => {
  const [menuState, setMenuState] = useState({
    productosOpen: false,
    activeItem: "Inicio"
  });

  const toggleProductos = () => {
    setMenuState(prev => ({
      ...prev,
      productosOpen: !prev.productosOpen
    }));
  };

  const setActiveItem = (item) => {
    setMenuState(prev => ({
      ...prev,
      activeItem: item
    }));
  };

  return (
    <MenuContext.Provider value={{
      productosOpen: menuState.productosOpen,
      activeItem: menuState.activeItem,
      toggleProductos,
      setActiveItem
    }}>
      {children}
    </MenuContext.Provider>
  );
};