import { db } from "@/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { products, saleItems, sales } from "@/db/schemas";
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/trpc/init";
import z from "zod";

export const homeRouter = createTRPCRouter({
    getManySales: protectedProcedure
        .input(z.void())
        .query(async ({ ctx }) => {
            const rows = await db
                .select({
                    date: sql<string>`DATE(${sales.saleDate})::text`.as('date'),
                    totalDia: sql<string>`COALESCE(SUM(${sales.totalAmount}), 0)::text`.as('total_dia'),
                })
                .from(sales)
                .where(
                    and(
                        eq(sales.tenantId, ctx.auth.user.tenant_id),
                        sql`DATE(${sales.saleDate}) >= CURRENT_DATE - INTERVAL '21 days'`
                    )
                )
                .groupBy(sql`DATE(${sales.saleDate})`)
                .orderBy(desc(sql`DATE(${sales.saleDate})`));

            const mapped = rows.map(r => ({
                date: r.date,
                sales: Number(r.totalDia),
            }));

            return mapped;
        }),
    getTopProduct: protectedProcedure
        .input(z.void())
        .query(async ({ ctx }) => {
            const result = await db
                .select({
                    productId: saleItems.productId,
                    productName: products.name,
                    totalQuantity: sql<string>`COALESCE(SUM(${saleItems.quantity}), 0)::text`.as('total_quantity'),
                })
                .from(saleItems)
                .innerJoin(sales, eq(saleItems.saleId, sales.id))
                .innerJoin(products, eq(saleItems.productId, products.id))
                .where(
                    and(
                        eq(saleItems.tenantId, ctx.auth.user.tenant_id),
                        sql`DATE(${sales.saleDate}) >= CURRENT_DATE - INTERVAL '21 days'`
                    )
                )
                .groupBy(saleItems.productId, products.name)
                .orderBy(desc(sql`SUM(${saleItems.quantity})`))
                .limit(1);

            if (result.length === 0) {
                return {
                    productName: "Sin datos",
                    totalQuantity: 0,
                };
            }

            return {
                productName: result[0].productName,
                totalQuantity: Number(result[0].totalQuantity),
            };
        }),

    getDailySales: protectedProcedure
        .input(z.void())
        .query(async ({ ctx }) => {
            const todaySales = await db
                .select({
                    total: sql<string>`COALESCE(SUM(${sales.totalAmount}), 0)::text`.as('total'),
                })
                .from(sales)
                .where(
                    and(
                        eq(sales.tenantId, ctx.auth.user.tenant_id),
                        sql`DATE(${sales.saleDate}) = CURRENT_DATE`
                    )
                );

            const yesterdaySales = await db
                .select({
                    total: sql<string>`COALESCE(SUM(${sales.totalAmount}), 0)::text`.as('total'),
                })
                .from(sales)
                .where(
                    and(
                        eq(sales.tenantId, ctx.auth.user.tenant_id),
                        sql`DATE(${sales.saleDate}) = CURRENT_DATE - INTERVAL '1 day'`
                    )
                );

            const todayTotal = Number(todaySales[0]?.total || 0);
            const yesterdayTotal = Number(yesterdaySales[0]?.total || 0);

            let percentageChange = 0;
            if (yesterdayTotal > 0) {
                percentageChange = ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
            }

            return {
                todayTotal,
                yesterdayTotal,
                percentageChange: Number(percentageChange.toFixed(1)),
                isIncrease: percentageChange >= 0,
            };
        }),

    getDashboardData: protectedProcedure
        .input(z.void())
        .query(async ({ ctx }) => {
            const tenantId = ctx.auth.user.tenant_id;

            const topProduct = await db
                .select({
                    productName: products.name,
                    totalQuantity: sql<string>`COALESCE(SUM(${saleItems.quantity}), 0)::text`.as('total_quantity'),
                })
                .from(saleItems)
                .innerJoin(sales, eq(saleItems.saleId, sales.id))
                .innerJoin(products, eq(saleItems.productId, products.id))
                .where(
                    and(
                        eq(saleItems.tenantId, tenantId),
                        sql`DATE(${sales.saleDate}) >= CURRENT_DATE - INTERVAL '21 days'`
                    )
                )
                .groupBy(products.name)
                .orderBy(desc(sql`SUM(${saleItems.quantity})`))
                .limit(1);

            const todaySales = await db.select({
                total: sql<string>`COALESCE(SUM(${sales.totalAmount}), 0)::text`.as('total'),
            }).from(sales)
                .where(
                    and(
                        eq(sales.tenantId, tenantId),
                        sql`DATE(${sales.saleDate}) = NOW()`
                    )
                )

            const yesterdaySales = await db.select({
                total: sql<string>`COALESCE(SUM(${sales.totalAmount}), 0)::text`.as('total'),
            }).from(sales)
                .where(
                    and(
                        eq(sales.tenantId, tenantId),
                        sql`DATE(${sales.saleDate}) = NOW() - INTERVAL '1 day'`
                    )
                )

            const todayTotal = Number(todaySales[0]?.total ?? 0);
            const yesterdayTotal = Number(yesterdaySales[0]?.total ?? 0);
            const percentageChange = yesterdayTotal > 0
                ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100
                : 0;

            const chartData = await db
                .select({
                    date: sql<string>`DATE(${sales.saleDate})::text`.as('date'),
                    totalDia: sql<string>`COALESCE(SUM(${sales.totalAmount}), 0)::text`.as('total_dia'),
                })
                .from(sales)
                .where(
                    and(
                        eq(sales.tenantId, tenantId),
                        sql`DATE(${sales.saleDate}) >= CURRENT_DATE - INTERVAL '21 days'`
                    )
                )
                .groupBy(sql`DATE(${sales.saleDate})`)
                .orderBy(desc(sql`DATE(${sales.saleDate})`));

            console.log(
                todayTotal,
                yesterdayTotal,
                Number(percentageChange.toFixed(1)),
                percentageChange >= 0,
            )

            return {
                topProduct: {
                    productName: topProduct[0]?.productName || "Sin datos",
                    totalQuantity: Number(topProduct[0]?.totalQuantity || 0),
                },
                dailySales: {
                    todayTotal,
                    yesterdayTotal,
                    percentageChange: Number(percentageChange.toFixed(1)),
                    isIncrease: percentageChange >= 0,
                },
                chartData: chartData.map(r => ({
                    date: new Date(r.date + 'T00:00:00Z'),
                    sales: Number(r.totalDia),
                })),
            };
        }),
});
