import { db } from "@/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { products, saleItems, sales } from "@/db/schemas";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const historialVentasRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(z.object({
      page: z.number().default(DEFAULT_PAGE),
      pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    }))
    .query(async ({ input, ctx }) => {
      const { page, pageSize } = input;

      const salesByDate = await db
        .select({
          date: sql<string>`DATE(${sales.saleDate})::text`.as('date'),
          cantidadTransactions: sql<string>`COUNT(DISTINCT ${sales.id})::text`.as('cantidad_transactions'),
          totalDia: sql<number>`COALESCE(SUM(${sales.totalAmount}), 0)`.as('total_dia'),
          productoVendidos: sql<string>`COUNT(${saleItems.id})::text`.as('producto_vendidos'),
        })
        .from(sales)
        .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
        .where(
          and(
            eq(sales.tenantId, ctx.auth.user.tenant_id),
          )
        )
        .groupBy(sql`DATE(${sales.saleDate})`)
        .orderBy(desc(sql`DATE(${sales.saleDate})`))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const enrichedData = await Promise.all(salesByDate.map(async (day) => {
        const [topProduct] = await db
          .select({
            productName: products.name,
            totalQuantity: sql<number>`SUM(${saleItems.quantity})`,
          })
          .from(saleItems)
          .innerJoin(sales, eq(saleItems.saleId, sales.id))
          .innerJoin(products, eq(saleItems.productId, products.id))
          .where(
            and(
              eq(sales.tenantId, ctx.auth.user.tenant_id),
              sql`DATE(${sales.saleDate}) = ${day.date}::date`
            )
          )
          .groupBy(products.id, products.name)
          .orderBy(desc(sql`SUM(${saleItems.quantity})`))
          .limit(1);

        return {
          ...day,
          topProduct: topProduct || null
        };
      }));

      const [total] = await db
        .select({
          count: sql<number>`COUNT(DISTINCT DATE(${sales.saleDate}))`
        })
        .from(sales)
        .where(eq(sales.tenantId, ctx.auth.user.tenant_id));

      const totalPages = Math.ceil((total.count) / pageSize);


      return {
        items: enrichedData,
        page,
        pageSize,
        totalPages,
      };
    }),
});
