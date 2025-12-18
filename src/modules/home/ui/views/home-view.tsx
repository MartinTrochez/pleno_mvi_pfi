"use client";
import {
  TrendingUp,
  TrendingDown,
  Package,
  TrendingDownIcon,
  TrendingUpIcon,
  PackageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SalesChart from "../components/sales-chart";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const HomeView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.home.getDashboardData.queryOptions());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="px-4 md:px-8 space-y-8">
      <div className="grid md:grid-cols-2 justify-items-center gap-4 rounded-lg bg-gray-100 p-4 w-full">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Producto más Vendido
                </p>
                <p className="text-xl font-bold">
                  {data.topProduct.totalQuantity}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef2d6]">
                <PackageIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">
                {data.topProduct.productName}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Ventas Diarias
                </p>
                <p className="text-xl font-bold">
                  {formatCurrency(data.dailySales.todayTotal)}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  data.dailySales.isIncrease ? "bg-emerald-100" : "bg-red-100"
                }`}
              >
                {data.dailySales.isIncrease ? (
                  <TrendingUpIcon className="h-6 w-6 text-emerald-600" />
                ) : (
                  <TrendingDownIcon className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-1">
              {data.dailySales.isIncrease ? (
                <TrendingUpIcon className="h-4 w-4 text-emerald-500" />
              ) : (
                <TrendingDownIcon className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  data.dailySales.isIncrease
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {Math.abs(data.dailySales.percentageChange)}%
              </span>
              <span className="text-sm text-muted-foreground">
                {data.dailySales.isIncrease ? "Más" : "Menos"} que ayer
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <SalesChart />
    </div>
  );
};
