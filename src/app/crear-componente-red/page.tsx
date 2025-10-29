"use client";
import CreateForm from "@/components/ComponentForm";
import Header from "./Header";
import NavMenu from "./NavMenu";

export default function DetalleComponenteRed() {
  return (
    <main className="grid grid-rows-[auto_1fr] w-full h-full grid-cols-1">
      <Header />
      <section className="w-full h-full grid gap-2 grid-cols-[360px_1fr] overflow-hidden p-2">
        <NavMenu />
        <CreateForm />
      </section>
    </main>
  );
}
