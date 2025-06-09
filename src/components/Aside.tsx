"use client";
import { ReactNode } from "react";
export default function Aside({
  children,
  className,
  onClose,
  zIndex = 999
}: {
  children?: ReactNode;
  className?: string;
  onClose?: () => void;
  zIndex?: number;
}) {
  return (
    <>
      <aside
        className={`h-full fixed right-0 top-0 bg-white z-[${zIndex > 0 ? zIndex + 1 : 0}] ${className}`}
      >
        {children}
      </aside>
      {
        zIndex > 0 && (
          <div
          className={`w-full bg-black/25 h-full fixed left-0 top-0 z-[${zIndex} ]`}
        />
        )
      }
    
    </>
  );
}
