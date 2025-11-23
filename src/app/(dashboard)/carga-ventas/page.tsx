import { requireAuth } from "@/lib/auth-utils";
import CargaVentasView from "@/modules/carga-ventas/ui/views/carga-ventas-view";

export default async function CargaVentasPage() {
  await requireAuth();

  return <CargaVentasView />;
}
