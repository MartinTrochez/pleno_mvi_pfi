"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { isWithinInterval } from "date-fns"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
 
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("date") as Date
      return new Intl.DateTimeFormat('es-AR', { 
        day: '2-digit', 
        month: 'short',
        year: "numeric",
      }).format(date)
    },
    filterFn: (row, id, value) => {
      if (!value) return true
      const { from, to } = value as { from: Date; to: Date }
      if (!from || !to) return true

      const rowDate = row.getValue(id) as Date
      return isWithinInterval(rowDate, { start: from, end: to })
    },
  },
  {
    accessorKey: "cantidadTransactions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N° Transacciones" />
    ),
  },
  {
    accessorKey: "topProducto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Top Producto" />
    ),
  },
  {
    accessorKey: "productoVendidos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Productos Vendidos" />
    ),
  },
  {
    accessorKey: "totalDia",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Día" />
    ),
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
