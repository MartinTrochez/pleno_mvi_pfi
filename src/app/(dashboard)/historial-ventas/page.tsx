import { requireAuth } from "@/lib/auth-utils";
import { loadSearchParams } from "@/modules/historial-ventas/search-params";
import { HistorialVentasView } from "@/modules/historial-ventas/ui/views/historial-ventas-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { SearchParams } from "nuqs";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function HistorialVentasPage({ searchParams }: Props) {
  await requireAuth();

  const filters = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.historialVentas.getMany.queryOptions({
      ...filters,
    }),
  );

  return <HistorialVentasView />;
}
