"use client";
import { ReactNode } from "react";
export default function Aside({
  children,
  className,
  onClose,
}: {
  children?: ReactNode;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <>
      <aside
        className={`h-full fixed right-0 top-0 bg-white z-[1000] ${className}`}
      >
        {children}
      </aside>
      <div
        className="w-full bg-black/25 h-full fixed left-0 top-0 z-[999]"
      />
    </>
  );
}
