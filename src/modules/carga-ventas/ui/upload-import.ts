export type VentaItem = {
  fecha: string | null;
  hora: string | null;
  nroTransaccion: number | null;
  codigo: string | null;
  descripcion: string | null;
  rubro: string | null;
  cantidad: number | null;
  unitario?: number | null;
  importe: number | null;
};

export type ImportSummary = {
  insertedSales: number;
  insertedItems: number;
  createdProducts: number;
};

export async function uploadSalesImport(items: VentaItem[], opts?: {
  userId?: number;
  cashRegister?: number;
  timezone?: string;
}): Promise<ImportSummary> {
  const metadata = {
    tenantId: 1, // fijo por ahora
    userId: opts?.userId ?? 1,
    cashRegister: opts?.cashRegister ?? 1,
    timezone: opts?.timezone ?? "America/Argentina/Buenos_Aires",
  };

  const res = await fetch("/api/sales/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, metadata }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Error al importar ventas");
  }

  return (await res.json()) as ImportSummary;
}
