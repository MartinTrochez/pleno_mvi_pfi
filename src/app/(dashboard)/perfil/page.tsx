import { requireAuth } from "@/lib/auth-utils";
import PerfilView from "@/modules/perfil/ui/views/perfil-view";
import { getQueryClient, trpc } from "@/trpc/server";

export default async function PerfilPage() {
  await requireAuth();

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.perfil.get.queryOptions());
  return <PerfilView />;
}
