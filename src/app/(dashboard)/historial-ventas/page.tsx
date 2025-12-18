import { requireAuth } from "@/lib/auth-utils";
import { HistorialVentasView } from "@/modules/historial-ventas/ui/views/historial-ventas-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function HistorialVentasPage() {
  await requireAuth();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.historialVentas.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HistorialVentasView />
    </HydrationBoundary>
  );
}
