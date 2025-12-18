import { StockProductosView } from "@/modules/stock-productos/ui/views/stock-productos-views";
import { requireAuth } from "@/lib/auth-utils";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function StockProductosPage() {
  await requireAuth();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.stockProductos.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StockProductosView />
    </HydrationBoundary>
  );
}
