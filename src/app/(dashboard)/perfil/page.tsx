import { requireAuth } from "@/lib/auth-utils";
import PerfilView from "@/modules/perfil/ui/views/perfil-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function PerfilPage() {
  await requireAuth();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.perfil.get.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PerfilView />
    </HydrationBoundary>
  );
}
