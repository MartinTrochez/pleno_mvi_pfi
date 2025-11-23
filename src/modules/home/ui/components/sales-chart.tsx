"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const salesData = [
  { date: "2025-09-01", sales: 222,},
  { date: "2025-09-02", sales: 97,  },
  { date: "2025-09-03", sales: 167, },
  { date: "2025-09-04", sales: 242, },
  { date: "2025-09-05", sales: 373, },
  { date: "2025-09-06", sales: 301, },
  { date: "2025-09-07", sales: 245, },
  { date: "2025-09-08", sales: 409, },
  { date: "2025-09-09", sales: 59, },
  { date: "2025-09-10", sales: 261, },
  { date: "2025-09-11", sales: 327, },
  { date: "2025-09-12", sales: 292, },
  { date: "2025-09-13", sales: 342, },
  { date: "2025-09-14", sales: 444, },
  { date: "2025-09-15", sales: 137, },
  { date: "2025-09-16", sales: 333, },
  { date: "2025-09-17", sales: 137, },
  { date: "2025-09-18", sales: 111, },
  { date: "2025-09-19", sales: 90, },
  { date: "2025-09-20", sales: 500, },
  { date: "2025-09-21", sales: 330, },
]

const chartConfig = {
  date: {
    label: "Date",
  },
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function SalesChart() {

  const maxSales = Math.max(...salesData.map(d => d.sales))
  const yAxisMax = Math.ceil(maxSales * 1.1 / 100) * 100 
  const tickInterval = Math.ceil(yAxisMax / 5 / 50) * 50
  const yAxisTicks = Array.from({ length: Math.floor(yAxisMax / tickInterval) + 1 }, (_, i) => i * tickInterval)

  return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-foreground">
            Historial Cantidad de Ventas Diarias - Últimas Tres semanas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-[300px] w-full"
          >
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
                  <stop
                    offset="5%"
                    stopColor="#4379ee"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#4379ee"
                    stopOpacity={0.1}
                  />
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
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
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
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
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
  )
}
