import React, { ButtonHTMLAttributes, DOMAttributes, ReactNode } from "react";
import { Color } from "../../types/props";

import "../../style/style.css";

type ButtonType = "fill" | "outline" | "text";

interface PropTypes<T> extends ButtonHTMLAttributes<DOMAttributes<T>> {
  children: ReactNode;
  disabled?: boolean;
  isIcon?: boolean;
  styleType?: ButtonType;
  color?: Color;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
  full?: boolean;
  type?: "button" | "submit" | "reset";
  usePadding?: boolean;
}

export default function Button<T>({
  children,
  onClick,
  styleType = "fill",
  color = "primary-400",
  disabled = false,
  isIcon = false,
  full = false,
  isLoading = false,
  className = "",
  type = "button",
  usePadding = true,
}: PropTypes<T>) {
  const buttonStyle = {
    fill: `bg-${color}`,
    outline: `bg-transparent border border-${color}`,
    text: `text-${color}`,
  };

  return (
    <button
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
      bg-gray-300
      rounded-lg font-medium text-sm outline-none transition ease-in-out 
      ${full && "w-full"}
      ${
        !usePadding
          ? "px-0 py-0"
            ? isIcon
            : "py-[14px] px-[15px]"
          : "py-3 px-5"
      } ${className}
      disabled:opacity-50`}
      type={type}
    >
      <span className="flex w-full space-x-2 transition justify-center ease-in-out">
        {isLoading && (
          <span className="animate-spin ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                className="fill-current"
                d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"
              />
            </svg>
          </span>
        )}
        <span className="flex items-center text-center justify-center">
          {children}
        </span>
      </span>
    </button>
  );
}
