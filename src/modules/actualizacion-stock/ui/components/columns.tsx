"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
 
export type ActualizacionStock = {
  id: number
  nombre: string
  codigoBarra: string
  categoria: string
  cantidad: number
  ajusteStock: number
}

export const columns: ColumnDef<ActualizacionStock>[] = [
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
  },
  {
    accessorKey: "ajusteStock",
    header: "Ajuste de Stock",
    cell: ({ row }) => {
      const [adjustment, setAdjustment] = useState<string>("")
      
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === "" || value === "-" || !isNaN(Number(value))) {
          setAdjustment(value)
          
          if (value !== "" && value !== "-" && !isNaN(Number(value))) {
            const adjustmentValue = Number(value)
            row.original.ajusteStock = adjustmentValue
          }
        }
      }

      return (
        <Input
          type="text"
          value={adjustment}
          onChange={handleChange}
          placeholder="0"
          className="w-24 h-8 text-center bg-gray-50 border-gray-200"
        />
      )
    },
  },
]
