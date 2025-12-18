"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
 
export type StockProductos = {
  id: number
  nombre: string
  codigoBarra: string
  categoria: string
  cantidad: number
  prioridad: string
}

const getPrioridadStyles = (prioridad: string) => {
  switch (prioridad) {
    case "Alta":
      return "bg-[#FFCCCC] text-[#FF5959]"
    case "Media":
      return "bg-[#FFFFCC] text-[#9C9900]"
    case "Baja":
      return "bg-[#CCE6CC] text-[#008000]"
    default:
      return ""
  }
}

export const columns: ColumnDef<StockProductos>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "nombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: "codigoBarra",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código de Barra" />
    ),
  },
  {
    accessorKey: "categoria",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoría" />
    ),
  },
  {
    accessorKey: "cantidad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cantidad" />
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<number>(columnId)
      if (!filterValue) return true
      return value > Number(filterValue)
    }
  },
  {
    accessorKey: "prioridad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridad" />
    ),
    cell: ({ row }) => {
      const prioridad = row.getValue("prioridad") as string
      return (
        <span className={`inline-block min-w-20 text-center px-3 py-1 rounded-md text-sm font-medium ${getPrioridadStyles(prioridad)}`}>
          {prioridad}
        </span>
      )
    },
  },
]
