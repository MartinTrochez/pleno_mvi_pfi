import { StockProductosView } from "@/modules/stock-productos/ui/views/stock-productos-views";
import { requireAdminAuth, requireAuth } from "@/lib/auth-utils";
import { getQueryClient, trpc } from "@/trpc/server";
import { SearchParams } from "nuqs";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function StockProductosPage({ searchParams }: Props) {
  await requireAuth();

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.stockProductos.getMany.queryOptions(),
  );

  return <StockProductosView />;
}
