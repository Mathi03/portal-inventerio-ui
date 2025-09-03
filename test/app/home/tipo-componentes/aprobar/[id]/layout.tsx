"use client";
import "material-symbols";

export default function HomeLayout({ children }: any) {
  return (
    <>
      <main className="grid grid-rows-[auto_1fr]">{children}</main>
    </>
  );
}
