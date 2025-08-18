"use client"
import { ReactNode } from "react";
import Header from "./Header";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`h-full w-full`}>
    <main className="grid grid-rows-[auto_1fr] w-full h-full">
      <Header />
      {children}
    </main>
    </div>
  );
}
