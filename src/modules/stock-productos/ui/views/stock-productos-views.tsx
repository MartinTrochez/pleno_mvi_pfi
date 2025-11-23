"use client";

import { DataTable } from "../components/data-table-stock-productos";
import { columns, StockProductos } from "../components/columns";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useStockProductosFilters } from "../../hooks/use-stock-productos-filter";
import { DataPaginationStockProductos } from "../components/data-table-pagination-stock-productos";

export const StockProductosView = () => {
  const [filters, setFilters] = useStockProductosFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.stockProductos.getMany.queryOptions({
      ...filters,
    }),
  );

  const stockProductos: StockProductos[] = data.items.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    codigoBarra: item.codigoBarra,
    categoria: item.categoria,
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
        <DataPaginationStockProductos
          page={filters.page}
          totalPages={data.totalPages}
          total={data.total}
          onPageChange={(page) => setFilters({ page })}
        />
      </div>
    </div>
  );
};
