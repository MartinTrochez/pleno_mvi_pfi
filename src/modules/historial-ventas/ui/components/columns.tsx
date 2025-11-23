"use client"
 
import { ColumnDef } from "@tanstack/react-table"
 
export type HistorialVentas = {
  date: Date
  cantidadTransactions: string
  topProducto: string
  productoVendidos: string
  totalDia: number
}

export const columns: ColumnDef<HistorialVentas>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date
      return new Intl.DateTimeFormat('es-AR', { 
        day: '2-digit', 
        month: 'short',
        year: "numeric",
      }).format(date)
    }
  },
  {
    accessorKey: "cantidadTransactions",
    header: "N° Transacciones",
  },
  {
    accessorKey: "topProducto",
    header: "Top Producto",
  },
  {
    accessorKey: "productoVendidos",
    header: "Productos Vendidos",
  },
  {
    accessorKey: "totalDia",
    header: "Total Día",
    cell: ({ row }) => {
      const total = row.getValue("totalDia") as number
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
      }).format(total)
    }
  },
]
