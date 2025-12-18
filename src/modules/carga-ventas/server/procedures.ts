import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { importarVentasConDrizzle, listarUltimasVentas } from "./import";
import type { VentaItem as ImportVentaItem } from "../types";
import z from "zod";

const ventaItemInput = z.object({
  fecha: z.string().nullable(),
  hora: z.string().nullable(),
  nroTransaccion: z.number().nullable(),
  codigo: z.string().nullable(),
  descripcion: z.string().nullable(),
  rubro: z.string().nullable(),
  cantidad: z.number().nullable(),
  unitario: z.number().nullable().optional(),
  importe: z.number().nullable(),
});

export const cargaVentasRouter = createTRPCRouter({
  importar: protectedProcedure
    .input(z.object({
      items: z.array(ventaItemInput).min(1),
      metadata: z.object({
        cashRegister: z.number().optional(),
        timezone: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const tenantId = Number(ctx.auth.user.tenant_id);
      const userId = Number(ctx.auth.user.id);
      const metadata = {
        tenantId,
        userId,
        cashRegister: input.metadata?.cashRegister ?? 1,
        timezone: input.metadata?.timezone ?? "America/Argentina/Buenos_Aires",
      };

      const items: ImportVentaItem[] = input.items.map((item) => ({
        fecha: item.fecha,
        hora: item.hora,
        nroTransaccion: item.nroTransaccion,
        codigo: item.codigo,
        descripcion: item.descripcion,
        rubro: item.rubro,
        cantidad: item.cantidad,
        unitario: item.unitario ?? null,
        importe: item.importe,
      }));

      return importarVentasConDrizzle(items, metadata);
    }),

  ultimasVentas: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(200).default(50) }).optional())
    .query(async ({ input, ctx }) => {
      const tenantId = Number(ctx.auth.user.tenant_id);
      const limit = input?.limit ?? 50;
      const ventas = await listarUltimasVentas(tenantId, limit);
      return ventas;
    }),
});
