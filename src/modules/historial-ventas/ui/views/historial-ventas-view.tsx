"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Minus, TrendingDown, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { DataTableHistorialVentas } from "../components/data-table-historial-ventas"
import { columns, HistorialVentas } from "../components/columns"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useHistorialVentasFilters } from "../../hooks/use-historial-ventas"

type MetricComparison = {
  readonly icon: LucideIcon
  readonly intentClass: string
  readonly message: string
}

const formatPercentChange = (value: number) => {
  const rounded = Number(value.toFixed(1))
  return Number.isInteger(rounded) ? `${rounded.toFixed(0)}%` : `${rounded}%`
}

const getMetricComparison = (current: number, previous: number): MetricComparison => {
  if (current === previous) {
    return {
      icon: Minus,
      intentClass: "text-muted-foreground",
      message: "Igual que el mes anterior",
    }
  }

  if (current === 0 && previous > 0) {
    return {
      icon: TrendingDown,
      intentClass: "text-red-500",
      message: "Sin ventas registradas este mes",
    }
  }

  const delta = current - previous
  const isIncrease = delta > 0
  const percent = previous === 0 ? 100 : Math.abs((delta / previous) * 100)

  return {
    icon: isIncrease ? TrendingUp : TrendingDown,
    intentClass: isIncrease ? "text-green-500" : "text-red-500",
    message: `${isIncrease ? "+" : "-"}${formatPercentChange(percent)} vs Mes Anterior`,
  }
}

export const HistorialVentasView = () => {
  const [filters, setFilters] = useHistorialVentasFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.historialVentas.getMany.queryOptions(),
  );

  const { items, metrics } = data;
  console.log("[HistorialVentasView] metrics", metrics);

  const historialVentas: HistorialVentas[] = items.map((item) => ({
    date: new Date(`${item.date}T00:00:00`),
    cantidadTransactions: item.cantidadTransactions,
    topProducto: item.topProduct ? item.topProduct.productName : "Sin ventas",
    productoVendidos: item.productoVendidos,
    totalDia: item.totalDia,
  }));

  const currencyFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const formatCurrency = (value: number) => currencyFormatter.format(value);

  const formattedMonthlyTotal = formatCurrency(metrics.monthlyTotal);
  const formattedDailyAverage = formatCurrency(metrics.dailyAverage);
  const formattedBestDayAmount = metrics.bestDay
    ? formatCurrency(metrics.bestDay.amount)
    : formatCurrency(0);

  const dateFormatter = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
  });
  const bestDayDateLabel = metrics.bestDay
    ? dateFormatter.format(new Date(`${metrics.bestDay.date}T00:00:00`))
    : "Sin registros";
  const bestDayHelper = metrics.bestDay
    ? `Mayor venta el ${bestDayDateLabel}`
    : "Sin registros disponibles";

  const salesComparison = getMetricComparison(
    metrics.monthlyTotal,
    metrics.previousMonthTotal ?? 0,
  );
  const dailyAverageComparison = getMetricComparison(
    metrics.dailyAverage,
    metrics.previousMonthAverage ?? 0,
  );
  const SalesComparisonIcon = salesComparison.icon;
  const DailyAverageComparisonIcon = dailyAverageComparison.icon;

  return (
    <div className="px-4 md:px-8 space-y-8">
      <div className="grid md:grid-cols-3 justify-items-center gap-4 rounded-lg bg-gray-100 p-4 w-full">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Ventas Totales (Mes)</p>
                <p className="text-xl font-bold">{formattedMonthlyTotal}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <SalesComparisonIcon className={`h-4 w-4 ${salesComparison.intentClass}`} />
              <span className={`text-sm font-medium ${salesComparison.intentClass}`}>
                {salesComparison.message}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Promedio por Día</p>
                <p className="text-xl font-bold">{formattedDailyAverage}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <DailyAverageComparisonIcon className={`h-4 w-4 ${dailyAverageComparison.intentClass}`} />
              <span className={`text-sm font-medium ${dailyAverageComparison.intentClass}`}>
                {dailyAverageComparison.message}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Mejor día del mes</p>
                <p className="text-xl font-bold">{formattedBestDayAmount}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-muted-foreground">{bestDayHelper}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <DataTableHistorialVentas data={historialVentas} columns={columns}/>
      </div>
    </div>
  )
}
