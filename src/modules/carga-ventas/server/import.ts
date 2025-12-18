"use server";
import { db } from "@/db";
import { and, eq, inArray, desc, sql } from "drizzle-orm";
import {
  sales,
  saleItems,
  products,
  inventory,
  categories,
} from "@/db/schemas";
import type { ImportMetadata, ImportResult, VentaItem } from "../types";

function parseSaleDate(fecha: string | null, hora: string | null): Date | null {
  if (!fecha) return null;
  const [d, m, y] = fecha.split("/");
  if (!d || !m || !y) return null;
  const h = (hora?.trim() || "00:00:00").padEnd(8, ":00");
  const isoLocal = `${y}-${m}-${d}T${h}`;
  const dt = new Date(isoLocal);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function inferUnitPrice(line: VentaItem): number {
  const direct = line.unitario;
  if (direct != null && Number.isFinite(direct) && direct > 0) {
    return Number(direct);
  }

  const total = line.importe;
  if (total != null && Number.isFinite(total) && total > 0) {
    const qty =
      line.cantidad != null &&
        Number.isFinite(line.cantidad) &&
        line.cantidad > 0
        ? Number(line.cantidad)
        : 1;
    const inferred = total / qty;
    if (Number.isFinite(inferred) && inferred > 0) {
      return inferred;
    }
    return Number(total);
  }

  return 0;
}

function toDecimalString(value: number, fractionDigits = 4): string {
  const safe = Number.isFinite(value) ? Number(value) : 0;
  return safe.toFixed(fractionDigits);
}

export async function importarVentasConDrizzle(
  items: VentaItem[],
  metadata: ImportMetadata,
): Promise<ImportResult> {
  if (!metadata?.tenantId || !metadata?.userId || !metadata?.cashRegister) {
    throw new Error("Faltan metadatos (tenantId, userId, cashRegister)");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Sin items a importar");
  }

  await db.execute(
    sql.raw(
      "SELECT setval('sales_id_seq', COALESCE((SELECT MAX(id) FROM sales), 0))",
    ),
  );
  await db.execute(
    sql.raw(
      "SELECT setval('sale_items_id_seq', COALESCE((SELECT MAX(id) FROM sale_items), 0))",
    ),
  );

  const byTx = new Map<number, VentaItem[]>();
  for (const it of items) {
    if (it.nroTransaccion == null) continue;
    byTx.set(it.nroTransaccion, [...(byTx.get(it.nroTransaccion) ?? []), it]);
  }

  let insertedSales = 0;
  let insertedItems = 0;
  let createdProducts = 0;

  const allSaleNumbers = Array.from(byTx.keys()).map(String);
  const existingSales = allSaleNumbers.length
    ? await db
      .select({ saleNumber: sales.saleNumber })
      .from(sales)
      .where(
        and(
          eq(sales.tenantId, metadata.tenantId),
          inArray(sales.saleNumber, allSaleNumbers),
        ),
      )
    : [];
  const existingSaleNumbers = new Set(existingSales.map((s) => s.saleNumber));

  const allBarcodes = new Set<string>();
  const allNames = new Set<string>();
  const allRubros = new Set<string>();

  for (const [saleNumber, lines] of byTx.entries()) {
    if (existingSaleNumbers.has(String(saleNumber))) continue;
    for (const l of lines) {
      if (l.codigo) allBarcodes.add(l.codigo);
      if (l.descripcion) allNames.add(l.descripcion);
      if (l.rubro?.trim()) allRubros.add(l.rubro.trim());
    }
  }

  // Fetch all existing products in one query
  const barcodeList = Array.from(allBarcodes);
  const nameList = Array.from(allNames);

  const foundByBarcode = barcodeList.length
    ? await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.tenantId, metadata.tenantId),
          inArray(products.barcode, barcodeList),
        ),
      )
    : [];
  const foundByName = nameList.length
    ? await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.tenantId, metadata.tenantId),
          inArray(products.name, nameList),
        ),
      )
    : [];

  const byBarcode = new Map<string, { id: number; salePrice: number }>();
  for (const p of foundByBarcode)
    byBarcode.set(String(p.barcode), {
      id: Number(p.id),
      salePrice: Number(p.salePrice),
    });
  const byName = new Map<string, { id: number; salePrice: number }>();
  for (const p of foundByName)
    byName.set(String(p.name), {
      id: Number(p.id),
      salePrice: Number(p.salePrice),
    });

  const rubroList = Array.from(allRubros);
  const categoriesFound = rubroList.length
    ? await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.tenantId, metadata.tenantId),
          inArray(categories.name, rubroList),
        ),
      )
    : [];
  const categoryIndex = new Map<string, number>();
  for (const c of categoriesFound)
    categoryIndex.set(String(c.name), Number(c.id));

  const missingRubros = rubroList.filter((name) => !categoryIndex.has(name));
  if (missingRubros.length) {
    const insertedCategories = await db
      .insert(categories)
      .values(
        missingRubros.map((name) => ({
          tenantId: metadata.tenantId,
          name,
          isActive: true,
        })),
      )
      .returning({ id: categories.id, name: categories.name });

    for (const cat of insertedCategories) {
      categoryIndex.set(String(cat.name), Number(cat.id));
    }
  }

  const productsToCreate: Array<{
    bc: string | undefined;
    nm: string | undefined;
    categoryId: number | undefined;
    salePrice: string;
  }> = [];
  const seenProductKeys = new Set<string>();

  for (const [saleNumber, lines] of byTx.entries()) {
    if (existingSaleNumbers.has(String(saleNumber))) continue;
    for (const l of lines) {
      const bc = l.codigo || undefined;
      const nm = l.descripcion || undefined;
      const exists = (bc && byBarcode.has(bc)) || (nm && byName.has(nm));
      if (!exists && (bc || nm)) {
        const key = bc ?? nm ?? "";
        if (seenProductKeys.has(key)) continue;
        seenProductKeys.add(key);

        const rubroKey = l.rubro?.trim();
        const categoryId = rubroKey ? categoryIndex.get(rubroKey) : undefined;
        const unitPriceForProduct = inferUnitPrice(l);
        const formattedSalePrice = toDecimalString(unitPriceForProduct);
        productsToCreate.push({
          bc,
          nm,
          categoryId,
          salePrice: formattedSalePrice,
        });
      }
    }
  }

  if (productsToCreate.length) {
    const insertedProds = await db
      .insert(products)
      .values(
        productsToCreate.map((p, idx) => ({
          tenantId: metadata.tenantId,
          sku: p.bc ?? p.nm ?? `SKU-${Date.now()}-${idx}`,
          barcode: p.bc,
          name: p.nm ?? p.bc ?? "Producto sin nombre",
          description: null,
          categoryId: p.categoryId,
          salePrice: p.salePrice,
          isActive: true,
          unitOfMeasure: "unidad",
          minStock: 15,
        })),
      )
      .returning({
        id: products.id,
        barcode: products.barcode,
        name: products.name,
        salePrice: products.salePrice,
      });

    for (const prod of insertedProds) {
      const prodId = Number(prod.id);
      const effectiveSalePrice = Number(prod.salePrice);
      if (prod.barcode)
        byBarcode.set(String(prod.barcode), {
          id: prodId,
          salePrice: effectiveSalePrice,
        });
      if (prod.name)
        byName.set(String(prod.name), {
          id: prodId,
          salePrice: effectiveSalePrice,
        });
    }
    createdProducts = insertedProds.length;

    const newProductIds = insertedProds.map((p) => Number(p.id));
    const existingInventory = await db
      .select({ productId: inventory.productId })
      .from(inventory)
      .where(
        and(
          eq(inventory.tenantId, metadata.tenantId),
          inArray(inventory.productId, newProductIds),
        ),
      );
    const existingInvProductIds = new Set(
      existingInventory.map((i) => i.productId),
    );

    const inventoryToCreate = newProductIds.filter(
      (id) => !existingInvProductIds.has(id),
    );
    if (inventoryToCreate.length) {
      await db.insert(inventory).values(
        inventoryToCreate.map((productId) => ({
          tenantId: metadata.tenantId,
          productId,
          quantity: "0",
          reservedQuantity: "0",
        })),
      );
    }
  }

  const salesToInsert: Array<{
    saleNumber: number;
    saleDate: Date;
    subtotal: number;
    totalAmount: number;
    prepared: Array<{
      productId: number;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>;
  }> = [];
  const productPriceUpdates = new Map<number, number>();

  for (const [saleNumber, lines] of byTx.entries()) {
    if (existingSaleNumbers.has(String(saleNumber))) continue;

    const first = lines.find((l) => l.fecha) ?? lines[0];
    const saleDate =
      parseSaleDate(first?.fecha ?? null, first?.hora ?? null) ?? new Date();

    let subtotal = 0;
    const prepared: Array<{
      productId: number;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }> = [];

    for (const l of lines) {
      const qtyBase =
        l.cantidad != null && Number.isFinite(l.cantidad) && l.cantidad > 0
          ? Number(l.cantidad)
          : 1;
      const qty = qtyBase > 0 ? qtyBase : 1;
      const prod =
        (l.codigo ? byBarcode.get(l.codigo) : undefined) ??
        (l.descripcion ? byName.get(l.descripcion) : undefined);
      if (!prod) continue;
      const inferredFromLine = inferUnitPrice(l);
      let unit =
        inferredFromLine > 0 ? inferredFromLine : (prod.salePrice ?? 0);
      let lineTotal =
        l.importe != null && Number.isFinite(l.importe)
          ? Number(l.importe)
          : unit * qty;

      if ((unit <= 0 || !Number.isFinite(unit)) && lineTotal > 0 && qty > 0) {
        unit = lineTotal / qty;
      }

      if (!Number.isFinite(lineTotal)) lineTotal = 0;
      if (!Number.isFinite(unit)) unit = 0;

      subtotal += lineTotal;
      prepared.push({
        productId: prod.id,
        quantity: qty,
        unitPrice: unit,
        lineTotal,
      });

      if (unit > 0) {
        if (l.codigo) byBarcode.set(l.codigo, { id: prod.id, salePrice: unit });
        if (l.descripcion)
          byName.set(l.descripcion, { id: prod.id, salePrice: unit });

        if (prod.salePrice <= 0) {
          productPriceUpdates.set(prod.id, unit);
        }
      }
    }

    const taxAmount = 0;
    const discountAmount = 0;
    const totalAmount = subtotal + taxAmount - discountAmount;

    salesToInsert.push({
      saleNumber,
      saleDate,
      subtotal,
      totalAmount,
      prepared,
    });
  }

  if (productPriceUpdates.size > 0) {
    const updatePromises = Array.from(productPriceUpdates.entries()).map(
      ([productId, price]) =>
        db
          .update(products)
          .set({ salePrice: toDecimalString(price) })
          .where(
            and(
              eq(products.tenantId, metadata.tenantId),
              eq(products.id, productId),
            ),
          ),
    );
    await Promise.all(updatePromises);
  }

  if (salesToInsert.length) {
    const insertedSalesResult = await db
      .insert(sales)
      .values(
        salesToInsert.map((s) => ({
          tenantId: metadata.tenantId,
          saleNumber: String(s.saleNumber),
          customerId: null,
          userId: metadata.userId,
          saleDate: s.saleDate,
          subtotal: toDecimalString(s.subtotal, 2),
          taxAmount: toDecimalString(0, 2),
          discountAmount: toDecimalString(0, 2),
          totalAmount: toDecimalString(s.totalAmount, 2),
          paymentMethod: null,
          status: "completado",
          notes: null,
          cashRegister: metadata.cashRegister,
        })),
      )
      .returning({ id: sales.id });

    insertedSales = insertedSalesResult.length;

    const allSaleItems: Array<{
      tenantId: number;
      saleId: number;
      productId: number;
      quantity: string;
      unitPrice: string;
      discountPercentage: string;
      lineTotal: string;
    }> = [];

    const inventoryAdjustments = new Map<number, number>();

    for (let i = 0; i < insertedSalesResult.length; i++) {
      const saleId = Number(insertedSalesResult[i].id);
      const { prepared } = salesToInsert[i];

      for (const pi of prepared) {
        allSaleItems.push({
          tenantId: metadata.tenantId,
          saleId,
          productId: pi.productId,
          quantity: toDecimalString(pi.quantity, 4),
          unitPrice: toDecimalString(pi.unitPrice, 4),
          discountPercentage: "0",
          lineTotal: toDecimalString(pi.lineTotal, 2),
        });

        const currentAdj = inventoryAdjustments.get(pi.productId) ?? 0;
        inventoryAdjustments.set(pi.productId, currentAdj + pi.quantity);
      }
    }

    if (allSaleItems.length) {
      await db.insert(saleItems).values(allSaleItems);
      insertedItems = allSaleItems.length;
    }

    const productIdsToUpdate = Array.from(inventoryAdjustments.keys());
    if (productIdsToUpdate.length) {
      const currentInventory = await db
        .select({
          productId: inventory.productId,
          quantity: inventory.quantity,
        })
        .from(inventory)
        .where(
          and(
            eq(inventory.tenantId, metadata.tenantId),
            inArray(inventory.productId, productIdsToUpdate),
          ),
        );

      const inventoryMap = new Map<number, number>();
      for (const inv of currentInventory) {
        inventoryMap.set(inv.productId, Number(inv.quantity));
      }

      const missingInventoryProducts = productIdsToUpdate.filter(
        (id) => !inventoryMap.has(id),
      );
      if (missingInventoryProducts.length) {
        await db.insert(inventory).values(
          missingInventoryProducts.map((productId) => ({
            tenantId: metadata.tenantId,
            productId,
            quantity: "0",
            reservedQuantity: "0",
          })),
        );
        for (const productId of missingInventoryProducts) {
          inventoryMap.set(productId, 0);
        }
      }

      const inventoryUpdatePromises = productIdsToUpdate.map((productId) => {
        const currentQty = inventoryMap.get(productId) ?? 0;
        const adjustment = inventoryAdjustments.get(productId) ?? 0;
        const newQty = currentQty - adjustment;
        return db
          .update(inventory)
          .set({
            quantity: toDecimalString(newQty, 4),
            lastUpdated: new Date(),
          })
          .where(
            and(
              eq(inventory.tenantId, metadata.tenantId),
              eq(inventory.productId, productId),
            ),
          );
      });
      await Promise.all(inventoryUpdatePromises);
    }
  }

  return { insertedSales, insertedItems, createdProducts };
}

export async function listarUltimasVentas(tenantId: number, limit = 50) {
  return await db
    .select({
      id: sales.id,
      saleNumber: sales.saleNumber,
      saleDate: sales.saleDate,
      totalAmount: sales.totalAmount,
      cashRegister: sales.cashRegister,
      status: sales.status,
    })
    .from(sales)
    .where(eq(sales.tenantId, tenantId))
    .orderBy(desc(sales.id))
    .limit(limit);
}
