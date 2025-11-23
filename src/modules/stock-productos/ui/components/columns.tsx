"use client"
 
import { ColumnDef } from "@tanstack/react-table"
 
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
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "codigoBarra",
    header: "Código de Barra",
  },
  {
    accessorKey: "categoria",
    header: "Categoría",
  },
  {
    accessorKey: "cantidad",
    header: "Cantidad",
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<number>(columnId)
      if (!filterValue) return true
      return value > Number(filterValue)
    }
  },
  {
    accessorKey: "prioridad",
    header: "Prioridad",
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
