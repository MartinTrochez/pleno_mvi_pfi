"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

export type ActualizacionStock = {
  id: number
  nombre: string
  codigoBarra: string
  categoria: string
  cantidad: number
  ajuste: number
}

type ColumnMeta = {
  onStockUpdate?: (productId: number, adjustment: number | null) => void
  pendingAdjustments?: Record<number, number>
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
    accessorKey: "ajuste",
    header: "Ajuste",
    cell: ({ row, table }) => {
      const meta = table.options.meta as ColumnMeta | undefined
      const pendingValue = meta?.pendingAdjustments?.[row.original.id]
      const [inputValue, setInputValue] = useState<string>(
        pendingValue !== undefined ? pendingValue.toString() : "",
      )

      useEffect(() => {
        const nextValue =
          pendingValue !== undefined && !Number.isNaN(pendingValue)
            ? pendingValue.toString()
            : ""
        setInputValue(nextValue)
      }, [pendingValue])

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        if (value === "" || value === "-" || !Number.isNaN(Number(value))) {
          setInputValue(value)
        }
      }

      const commitValue = () => {
        if (!meta?.onStockUpdate) {
          return
        }

        if (inputValue === "" || inputValue === "-") {
          meta.onStockUpdate(row.original.id, null)
          return
        }

        const parsedValue = Number(inputValue)
        if (!Number.isNaN(parsedValue)) {
          meta.onStockUpdate(row.original.id, parsedValue)
        }
      }

      const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          event.currentTarget.blur()
        }
        if (event.key === "Escape") {
          setInputValue(pendingValue !== undefined ? pendingValue.toString() : "")
        }
      }

      return (
        <Input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={commitValue}
          onKeyDown={handleKeyDown}
          placeholder="0"
          className="w-24 h-8 text-center bg-gray-50 border-gray-200"
        />
      )
    },
  },
]
