import { StockProductosView } from "@/modules/stock-productos/ui/views/stock-productos-views";
import { requireAdminAuth, requireAuth } from "@/lib/auth-utils";
import { loadSearchParams } from "@/modules/usuarios/searchParams";
import { getQueryClient, trpc } from "@/trpc/server";
import { SearchParams } from "nuqs";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function StockProductosPage({ searchParams }: Props) {
  await requireAuth();

  const filters = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.stockProductos.getMany.queryOptions({
      ...filters,
    }),
  );

  return <StockProductosView />;
}
