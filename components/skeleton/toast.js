import React, { useContext, useState } from "react";
import CartContext from "@/context/CartContext";
import { HiFire, HiX } from "react-icons/hi";
import { FaTelegramPlane, FaRegHeart } from "react-icons/fa";

const Toast = ({ message, color, icon, type }) => {
  console.log("color", color);
  const { toastTagClose } = useContext(CartContext);

  const toastClose = () => {
    toastTagClose();
  };
  return (
    <div
      className={`top-8 fixed justify-center items-center flex py-3 px-6 border-[1px] rounded-lg bg-${color} z-1 right-1/2 top-[0px] toast`}
      role="alert"
    >
      <div className="flex flex-row gap-4">
        {type == "success" ? (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
            <HiFire className="h-5 w-5" />
          </div>
        ) : type == "login" ? (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
            <FaTelegramPlane className="h-5 w-5" />
          </div>
        ) : type == "error" ? (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 border-red-500 dark:bg-red-800 dark:text-red-200">
            <HiX className="h-5 w-5" />
          </div>
        ) : type == "wishlist" ? (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
            <FaRegHeart className="h-5 w-5" />
          </div>
        ) : null}

        <p className="grid content-center text-paymentCartText text-sm">
          {message}
        </p>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg  dark:bg-red-800 dark:text-red-200 cursor-pointer">
          <HiX className="h-5 w-5" onClick={toastClose} />
        </div>
      </div>
    </div>
  );
};

export default Toast;
