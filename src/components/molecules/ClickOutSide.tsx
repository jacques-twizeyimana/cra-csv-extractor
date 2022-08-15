import React, { useRef, useEffect } from "react";

interface IProps {
  children: React.ReactNode;
  handleClickOutside: () => void;
}

function useOutsideAlerter(
  ref: React.MutableRefObject<HTMLDivElement | null>,
  handleClickOutside: () => void
) {
  useEffect(() => {
    function ClickOutsideListener(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handleClickOutside();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", ClickOutsideListener);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", ClickOutsideListener);
    };
  }, [ref]);
}

export function ClickOutSide({ children, handleClickOutside }: IProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useOutsideAlerter(wrapperRef, handleClickOutside);

  return <div ref={wrapperRef}>{children}</div>;
}
