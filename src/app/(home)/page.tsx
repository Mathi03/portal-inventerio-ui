"use client";
import { ChartFuentes } from "./ChartFuentes";
import { ChartRedes } from "./ChartRedes";
import { ChartTipoComponente } from "./ChartTipoComponente";

export default function Home() {
  return (
    <section className="grid grid-cols-6 gap-2 py-2 px-[10%] isolate">
      <ChartTipoComponente />
      <ChartRedes />
      <ChartFuentes />
    </section>
  );
}
