"use client";
import { createContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [toastState, setToastState] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [toastColor, setToastColor] = useState();
  const [toastIcon, setToastIcon] = useState();
  const [toastType, setToastType] = useState();

  const toastTag = ({ message, color, icon, type }) => {
    setToastColor(color);
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastState(true);
    setTimeout(() => {
      setToastState(false);
    }, 4000);
  };

  const toastTagClose = () => {
    setToastState(false);
  };

  return (
    <CartContext.Provider
      value={{
        toastState,
        toastTag,
        toastMessage,
        toastColor,
        toastIcon,
        toastType,
        toastTagClose,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
