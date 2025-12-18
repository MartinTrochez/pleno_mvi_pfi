import { requireAuth } from "@/lib/auth-utils";
import { loadSearchParams } from "@/modules/usuarios/searchParams";
import { UsuariosView } from "@/modules/usuarios/ui/views/usuarios-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { SearchParams } from "nuqs";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function UsuariosPage({ searchParams }: Props) {
  await requireAuth();

  const filters = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.usuarios.getMany.queryOptions({
      ...filters,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsuariosView />
    </HydrationBoundary>
  );
}
