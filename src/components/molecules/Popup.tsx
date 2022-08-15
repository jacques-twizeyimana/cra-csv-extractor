import React, { ReactNode } from "react";
import Icon from "../atoms/Icon";
import { ClickOutSide } from "./ClickOutSide";

import "../../style/style.css";

type PropType = {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  onClose?: () => void;
  hasIcon?: boolean;
};

export default function Popup({
  open,
  onClose,
  children,
  title,
  hasIcon = true,
}: PropType) {
  const handleClose = () => {
    if (onClose) onClose();
  };

  return open ? (
    <div className="relative">
      <div className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-40 z-50  flex flex-col items-center justify-center">
        <ClickOutSide handleClickOutside={handleClose}>
          <div
            className={`bg-white shadow-lg rounded-lg relative overflow-y-auto`}
          >
            <div
              className={`flex justify-between rounded-t-lg px-6 bg-gray-200 border-b border-neutral-350 py-3`}
            >
              <h2 className="text-lg text-neutral-700 font-medium">{title}</h2>

              {hasIcon && (
                <button onClick={handleClose}>
                  <Icon name="close" size={30} />
                </button>
              )}
            </div>
            <div className="py-6 px-6">{children}</div>
          </div>
        </ClickOutSide>
      </div>
    </div>
  ) : null;
}
