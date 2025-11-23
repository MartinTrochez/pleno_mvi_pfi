"use client"

import { TrendingUp, TrendingDown, Package } from "lucide-react"

import { Card, CardContent} from "@/components/ui/card"

import SalesChart from "../components/sales-chart"

export const HomeView = () => {

  return (
    <div className="px-4 md:px-8 space-y-8">
      <div className="grid md:grid-cols-3 justify-items-center gap-4 rounded-lg bg-gray-100 p-4 w-full">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Placeholder</p>
                <p className="text-xl font-bold">Placeholder</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-1">
              <span className="text-sm font-medium">Lorem</span>
              <span className="text-sm text-muted-foreground">Lorem, ipsum</span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Producto mas Vendido</p>
                <p className="text-xl font-bold">320</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef2d6]">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">Nombre de Producto</span>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Ventas Diarias</p>
                <p className="text-xl font-bold">$89,000</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-1">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-500">4.3%</span>
              <span className="text-sm text-muted-foreground">Menos de Facturación</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <SalesChart />
    </div>
  )
}
