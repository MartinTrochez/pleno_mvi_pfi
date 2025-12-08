import { createAccountRouter } from '@/modules/auth/server/procedures';
import { createTRPCRouter } from '../init';
import { usuariosRouter } from '@/modules/usuarios/server/procedures';
import { perfilRouter } from '@/modules/perfil/server/procedures';
import { stockProductosRouter } from '@/modules/stock-productos/server/procedures';
import { historialVentasRouter } from '@/modules/historial-ventas/server/procedures';
import { tenantNameRouter } from '@/modules/dashboard/server/procedures';
import { homeRouter } from '@/modules/home/server/procedures';
import { actualizacionStockRouter } from '@/modules/actualizacion-stock/server/procedures';

export const appRouter = createTRPCRouter({
  createAccount: createAccountRouter,
  usuarios: usuariosRouter,
  perfil: perfilRouter,
  stockProductos: stockProductosRouter,
  historialVentas: historialVentasRouter,
  tenantName: tenantNameRouter,
  home: homeRouter,
  actualizacionStock: actualizacionStockRouter,
});

export type AppRouter = typeof appRouter;
