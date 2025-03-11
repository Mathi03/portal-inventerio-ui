import { ReactNode } from "react";
import Header from "./Header";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid grid-rows-[auto_1fr] w-full h-full">
      <Header />
      {children}
    </main>
  );
}
