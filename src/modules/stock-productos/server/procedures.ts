import { db } from "@/db";
import { eq, getTableColumns, and, desc, asc, count, sql } from "drizzle-orm"
import { categories, inventory, products, users } from "@/db/schemas";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const stockProductosRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(z.void())
    .query(async ({ input, ctx }) => {

      const data = await db
        .select({
          id: products.id,
          nombre: products.name,
          codigoBarra: products.barcode,
          categoria: categories.name,
          cantidad: inventory.quantity,
          prioridad: sql<string>`
        CASE 
          WHEN ${inventory.quantity} <= ${products.minStock} THEN 'Alta'
          WHEN ${inventory.quantity} <= ${products.minStock} * 1.5 THEN 'Baja'
          ELSE 'Media'
        END
      `,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .innerJoin(inventory, eq(products.id, inventory.productId))
        .where(eq(products.tenantId, ctx.auth.user.tenant_id))

      return {
        items: data,
      }
    }),
});

