"use client"
import { ReactNode } from "react";
import Header from "./Header";
import { useModalStore } from "@/hooks/modalStorage";

export default function HomeLayout({ children }: { children: ReactNode }) {
  const { isOpen } = useModalStore();
  return (
    <div className={`h-full w-full ${isOpen ? 'relative z-[-1]' : ''}`}>
    <main className="grid grid-rows-[auto_1fr] w-full h-full">
      <Header />
      {children}
    </main>
    </div>
  );
}
