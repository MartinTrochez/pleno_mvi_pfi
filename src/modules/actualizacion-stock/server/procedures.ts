import { db } from "@/db";
import { eq, and, count } from "drizzle-orm";
import { categories, inventory, products, inventoryMovements, users } from "@/db/schemas";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";

export const actualizacionStockRouter = createTRPCRouter({
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
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .innerJoin(inventory, eq(products.id, inventory.productId))
        .where(and(
          eq(products.tenantId, ctx.auth.user.tenant_id),
        )).orderBy(products.id)

      const [total] = await db
        .select({ count: count() })
        .from(products)
        .where(and(
          eq(products.tenantId, ctx.auth.user.tenant_id),
        ));


      return {
        items: data,
        total
      };
    }),

  updateStock: protectedProcedure
    .input(z.object({
      productId: z.number(),
      adjustment: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { productId, adjustment, notes } = input;

      const [currentInventory] = await db
        .select()
        .from(inventory)
        .where(and(
          eq(inventory.productId, productId),
          eq(inventory.tenantId, ctx.auth.user.tenant_id)
        ));

      if (!currentInventory) {
        throw new Error("Producto no encontrado en inventario");
      }

      const newQuantity = Number(currentInventory.quantity) + adjustment;

      if (newQuantity < 0) {
        throw new Error("El stock no puede ser negativo");
      }

      await db
        .update(inventory)
        .set({
          quantity: newQuantity.toString(),
          lastUpdated: new Date(),
        })
        .where(and(
          eq(inventory.productId, productId),
          eq(inventory.tenantId, ctx.auth.user.tenant_id)
        ));

      await db
        .insert(inventoryMovements)
        .values({
          tenantId: Number(ctx.auth.user.tenant_id),
          productId: productId,
          movementType: adjustment >= 0 ? "ajuste_positivo" : "ajuste_negativo",
          quantity: Math.abs(adjustment).toString(),
          referenceType: "actualizacion_stock",
          notes: notes || `Ajuste de stock: ${adjustment >= 0 ? '+' : ''}${adjustment}`,
          userId: Number(ctx.auth.user.id),
          movementDate: new Date(),
        });

      return {
        success: true,
        newQuantity,
        adjustment,
      };
    }),

  batchUpdateStock: protectedProcedure
    .input(z.object({
      updates: z.array(z.object({
        productId: z.number(),
        adjustment: z.number(),
        notes: z.string().optional(),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      const { updates } = input;

      const results = [] as Array<{
        productId: number;
        adjustment: number;
        newQuantity: number;
        success: boolean;
      }>;

      for (const update of updates) {
        const { productId, adjustment, notes } = update;

        const [currentInventory] = await db
          .select()
          .from(inventory)
          .where(and(
            eq(inventory.productId, productId),
            eq(inventory.tenantId, ctx.auth.user.tenant_id)
          ));

        if (!currentInventory) {
          throw new Error(`Producto ${productId} no encontrado en inventario`);
        }

        const newQuantity = Number(currentInventory.quantity) + adjustment;

        if (newQuantity < 0) {
          throw new Error(`El stock del producto ${productId} no puede ser negativo`);
        }

        await db
          .update(inventory)
          .set({
            quantity: newQuantity.toString(),
            lastUpdated: new Date(),
          })
          .where(and(
            eq(inventory.productId, productId),
            eq(inventory.tenantId, ctx.auth.user.tenant_id)
          ));

        await db
          .insert(inventoryMovements)
          .values({
            tenantId: Number(ctx.auth.user.tenant_id),
            productId: productId,
            movementType: adjustment >= 0 ? "ajuste_positivo" : "ajuste_negativo",
            quantity: Math.abs(adjustment).toString(),
            referenceType: "actualizacion_stock",
            notes: notes || `Ajuste de stock: ${adjustment >= 0 ? '+' : ''}${adjustment}`,
            userId: Number(ctx.auth.user.id),
            movementDate: new Date(),
          });

        results.push({
          productId,
          adjustment,
          newQuantity,
          success: true,
        });
      }

      return {
        success: true,
        results,
      };
    }),
});
