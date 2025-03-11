"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useCallback, useEffect, useState } from "react";
import { bff } from "@/core/config";
import dayjs from "dayjs";
import { DateField } from "@telefonica/mistica";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartRedes() {
  const [chartData, setChartData] = useState<
    Array<{ tc: string; percentage: number }>
  >([]);
  const [startDate, setStartDate] = useState<string>(
    dayjs().add(-1, "month").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const getStat = useCallback(async () => {
    const { data } = await bff.post("/v1/portal/components/stat/ref-network", {
      createdStartDate: dayjs(startDate).toISOString(),
      createdEndDate: dayjs(endDate).toISOString(),
    });
    setChartData(
      data.data.map((stat: any) => {
        return {
          red: stat.name,
          componentes: stat.quantity,
        };
      }),
    );
  }, [startDate, endDate]);
  useEffect(() => {
    getStat();
  }, [getStat]);
  return (
    <Card className="col-span-3 row-span-1">
      <CardHeader>
        <CardTitle>Redes</CardTitle>
        <p>Seleccione un rango de fecha</p>
        <menu className="flex gap-2">
          <DateField
            value={startDate}
            name="start-date"
            label="Fecha de inicio"
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
          <DateField
            value={endDate}
            name="end-date"
            label="Fecha de fin"
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
        </menu>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="red"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="componentes" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <p>
          A continuación, se mostrará una gráfica de barras verticales que
          indica la cantidad de componentes activos según la red.
        </p>
      </CardFooter>
    </Card>
  );
}
