import { requireAuth } from "@/lib/auth-utils";
import { ActualizacionStockView } from "@/modules/actualizacion-stock/ui/views/actualizacion-stock-view";

export default async function ActualizacionStockPage() {
  await requireAuth()

  return(
    <ActualizacionStockView />
  )
}
