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
    .input(z.void())
    .query(async ({ ctx }) => {

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
          topProduct: topProduct || null,
        };
      }));

      const now = new Date();
      const targetMonth = now.getMonth();
      const targetYear = now.getFullYear();

      const getEntriesForMonth = (year: number, month: number) => {
        return enrichedData.filter((day) => {
          const entryDate = new Date(`${day.date}T00:00:00`);
          return (
            entryDate.getMonth() === month &&
            entryDate.getFullYear() === year
          );
        });
      };

      const toNumber = (value: number | string | null | undefined) => {
        if (typeof value === "number") {
          return value;
        }
        if (typeof value === "string") {
          const parsed = Number(value);
          return Number.isNaN(parsed) ? 0 : parsed;
        }
        return 0;
      };

      const getTotals = (entries: typeof enrichedData) => {
        const total = entries.reduce((sum, day) => sum + toNumber(day.totalDia), 0);
        const average = entries.length > 0 ? total / entries.length : 0;
        return { total, average };
      };

      const currentMonthEntries = getEntriesForMonth(targetYear, targetMonth);

      const previousReferenceDate = new Date(targetYear, targetMonth, 1);
      previousReferenceDate.setMonth(previousReferenceDate.getMonth() - 1);
      const previousMonth = previousReferenceDate.getMonth();
      const previousYear = previousReferenceDate.getFullYear();
      const previousMonthEntries = getEntriesForMonth(previousYear, previousMonth);

      const { total: monthlyTotal, average: dailyAverage } = getTotals(currentMonthEntries);
      const { total: previousMonthTotal, average: previousMonthAverage } = getTotals(previousMonthEntries);

      const bestDayEntry = currentMonthEntries.reduce<(typeof currentMonthEntries)[number] | null>((best, day) => {
        if (best === null || day.totalDia > best.totalDia) {
          return day;
        }
        return best;
      }, null);

      return {
        items: enrichedData,
        metrics: {
          monthlyTotal,
          dailyAverage,
          previousMonthTotal,
          previousMonthAverage,
          bestDay: bestDayEntry
            ? {
                amount: bestDayEntry.totalDia,
                date: bestDayEntry.date,
              }
            : null,
        },
      };
    }),
});

