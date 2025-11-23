"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Calendar } from "lucide-react"

import { DataTableHistorialVentas } from "../components/data-table-historial-ventas"
import { columns, HistorialVentas } from "../components/columns"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { DataPaginationHistorialVentas } from "../components/data-table-pagination-historal-ventas"
import { useHistorialVentasFilters } from "../../hooks/use-historial-ventas"

export const HistorialVentasView = () => {
  const fecha = new Date(2025, 8, 15)
  const textoFecha = fecha.toLocaleDateString('es-AR', {day: "numeric", month: "long"})

  const [filters, setFilters] = useHistorialVentasFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.historialVentas.getMany.queryOptions({
      ...filters,
    }),
  );

const historialVentas: HistorialVentas[] = data.items.map((item) => ({
    date: new Date(item.date), 
    cantidadTransactions: item.cantidadTransactions,
    topProducto: item.topProduct ? item.topProduct.productName : "Sin ventas", 
    productoVendidos: item.productoVendidos, 
    totalDia: item.totalDia,
  }));

  return (
    <div className="px-4 md:px-8 space-y-8">
      <div className="grid md:grid-cols-3 justify-items-center gap-4 rounded-lg bg-gray-100 p-4 w-full">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Ventas Totales (Mes)</p>
                <p className="text-xl font-bold">$3.000.000</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-1">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-500">4.3%</span>
              <span className="text-sm text-muted-foreground">Vs Mes Anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Promedio por Día</p>
                <p className="text-xl font-bold">$89,000</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">4.3%</span>
              <span className="text-sm text-muted-foreground">Vs Mes Anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Mejor día del mes</p>
                <p className="text-xl font-bold">$1.756.658</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">{textoFecha}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <DataTableHistorialVentas data={historialVentas} columns={columns}/>
        <DataPaginationHistorialVentas
          page={filters.page}
          totalPages={data.totalPages}
          onPageChange={(page) => setFilters({ page })}
        />
      </div>
    </div>
  )
}
