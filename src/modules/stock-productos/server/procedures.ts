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
    .input(z.object({
      page: z.number().default(DEFAULT_PAGE),
      pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    }))
    .query(async ({ input, ctx }) => {
      const { page, pageSize } = input

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
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(inventory, eq(products.id, inventory.productId))
        .where(eq(products.tenantId, ctx.auth.user.tenant_id))
        .limit(pageSize).offset((page - 1) * pageSize)

      const [total] = await db
        .select({ count: count() })
        .from(products)
        .where(eq(products.tenantId, ctx.auth.user.tenant_id));

      const totalPages = Math.ceil(total.count / pageSize)

      return {
        items: data,
        total: total.count,
        totalPages,
      }
    }),
});

