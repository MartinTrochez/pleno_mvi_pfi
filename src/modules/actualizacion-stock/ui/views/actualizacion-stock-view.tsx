"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { ActualizacionStock, columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export const ActualizacionStockView = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [pendingAdjustments, setPendingAdjustments] = useState<Record<number, number>>({});

  const { data } = useSuspenseQuery(
    trpc.actualizacionStock.getMany.queryOptions(),
  );

  const baseBatchUpdateOptions = trpc.actualizacionStock.batchUpdateStock.mutationOptions();

  const batchUpdateMutation = useMutation({
    ...baseBatchUpdateOptions,
    onSuccess: async (result, variables, context, meta) => {
      await baseBatchUpdateOptions.onSuccess?.(result, variables, context, meta);
      setPendingAdjustments({});
      await queryClient.invalidateQueries({
        queryKey: trpc.actualizacionStock.getMany.queryKey(),
      });
    },
  });

  const actualizacionVentas: ActualizacionStock[] = data.items.map((item) => ({
    id: item.id ?? 0,
    codigoBarra: item.codigoBarra ?? "Sin codigo",
    nombre: item.nombre ?? "N/A",
    cantidad: Number(item.cantidad ?? 0),
    categoria: item.categoria ?? "",
    ajuste: pendingAdjustments[item.id ?? 0] ?? 0,
  }));

  const handleStockUpdate = (productId: number, adjustment: number | null) => {
    setPendingAdjustments((prev) => {
      const next = { ...prev };
      if (adjustment === null || adjustment === 0 || Number.isNaN(adjustment)) {
        delete next[productId];
      } else {
        next[productId] = adjustment;
      }
      return next;
    });
  };

  const handleSaveChanges = () => {
    const updates = Object.entries(pendingAdjustments).map(([productId, adjustment]) => ({
      productId: Number(productId),
      adjustment,
    }));

    if (updates.length === 0 || batchUpdateMutation.isPending) {
      return;
    }

    batchUpdateMutation.mutate({ updates });
  };

  const handleDiscardChanges = () => {
    if (batchUpdateMutation.isPending) {
      return;
    }
    setPendingAdjustments({});
  };

  return (
    <div className="flex-col items-center">
      <h1 className="pt-8 pl-8 text-xl text-black font-bold">
        Stock de Productos
      </h1>
      <div className="p-8">
        <DataTable
          data={actualizacionVentas}
          columns={columns}
          onStockUpdate={handleStockUpdate}
          pendingAdjustments={pendingAdjustments}
          onSaveChanges={handleSaveChanges}
          onDiscardChanges={handleDiscardChanges}
          isSaving={batchUpdateMutation.isPending}
        />
      </div>
    </div>
  );
};

