import { requireAuth } from "@/lib/auth-utils";
import { ActualizacionStockView } from "@/modules/actualizacion-stock/ui/views/actualizacion-stock-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function ActualizacionStockPage() {
  await requireAuth();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.actualizacionStock.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ActualizacionStockView />
    </HydrationBoundary>
  );
}
