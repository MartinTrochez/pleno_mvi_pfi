"use client";

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { z } from "zod";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const salesSchema = z.object({
  date: z.string(),
  sales: z.number(),
});

export type SalesData = z.infer<typeof salesSchema>;
const chartConfig = {
  date: {
    label: "Fecha",
  },
  sales: {
    label: "Ventas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function SalesChart() {
  const trpc = useTRPC();
  const { data: salesData } = useSuspenseQuery(trpc.home.getManySales.queryOptions());

  const maxSales = Math.max(...salesData.map((d) => d.sales));
  const yAxisMax = Math.ceil((maxSales * 1.1) / 100) * 100;
  const tickInterval = Math.ceil(yAxisMax / 5 / 50) * 50;
  const yAxisTicks = Array.from(
    { length: Math.floor(yAxisMax / tickInterval) + 1 },
    (_, i) => i * tickInterval,
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-foreground">
          Historial Cantidad de Ventas Diarias - Últimas Tres semanas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4379ee" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4379ee" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                horizontal={true}
                horizontalPoints={yAxisTicks}
                strokeDasharray="3 3"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                minTickGap={10}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => {
                  const date = value instanceof Date ? value : new Date(value);
                  if (isNaN(date.getTime())) return "";
                  return date.toLocaleDateString("es-AR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                domain={[0, yAxisMax]}
                ticks={yAxisTicks}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => {
                  const date = value instanceof Date ? value : new Date(value);
                  if (isNaN(date.getTime())) return "Invalid Date";
                  return date.toLocaleDateString("es-AR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <Area
                dataKey="sales"
                type="natural"
                fill="url(#fillSales)"
                stroke="#4379ee"
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
