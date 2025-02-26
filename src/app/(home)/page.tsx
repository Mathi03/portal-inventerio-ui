import { Chart1 } from "./Chart1";
import { Chart2 } from "./Chart2";
import { Chart3 } from "./Chart3";
import { Chart4 } from "./Chart4";
import { Chart5 } from "./Chart5";

export default function Home() {
  return (
    <section className="grid grid-cols-7 gap-2 p-2">
      <Chart1 />
      <Chart2 />
      <Chart4 />
      <Chart3 />
      <Chart3 />
      <Chart3 />
      <Chart5 />
    </section>
  );
}
