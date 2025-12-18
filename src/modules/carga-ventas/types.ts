export type VentaItem = {
  fecha: string | null;
  hora: string | null;
  nroTransaccion: number | null;
  codigo: string | null;
  descripcion: string | null;
  rubro: string | null;
  cantidad: number | null;
  precioUnitario?: number | null;
  unitario?: number | null;
  importe: number | null;
};

export type ImportMetadata = {
  tenantId: number;
  userId: number;
  cashRegister: number;
  timezone?: string;
};

export type ImportResult = {
  insertedSales: number;
  insertedItems: number;
  createdProducts: number;
};