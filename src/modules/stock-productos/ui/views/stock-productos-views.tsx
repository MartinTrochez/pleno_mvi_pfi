"use client";

import { DataTable } from "../components/data-table-stock-productos";
import { columns, StockProductos } from "../components/columns";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const StockProductosView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.stockProductos.getMany.queryOptions());

  const stockProductos: StockProductos[] = data.items.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    codigoBarra: item.codigoBarra,
    categoria: item.categoria || "Sin Clasificar",
    cantidad: Number(item.cantidad),
    prioridad: item.prioridad,
  })) as StockProductos[];

  return (
    <div className="flex-col items-center">
      <h1 className="pt-8 pl-8 text-xl text-black font-bold">
        Stock de Productos
      </h1>
      <div className="p-8 space-y-4">
        <DataTable data={stockProductos} columns={columns} />
      </div>
    </div>
  );
};
