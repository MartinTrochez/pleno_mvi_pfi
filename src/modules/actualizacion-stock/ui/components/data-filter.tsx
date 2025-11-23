"use client"

import { useState } from "react"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { SearchIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TableFiltersProps<TData> {
  table: Table<TData>
  data: TData[]
}

export function TableFilters<TData>({ table, data }: TableFiltersProps<TData>) {
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = (value: string) => {
    setSearchValue(value)
    table.getColumn("nombre")?.setFilterValue(value)
  }

  const clearFilters = () => {
    setSearchValue("")
    table.resetColumnFilters()
  }

  const hasActiveFilters = table.getState().columnFilters.length > 0 || searchValue !== ""

  return (
    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border">

      <div className="flex items-center gap-2 flex-1">
        <SearchIcon className="text-[#A4A4A5]" />
        <Input
          placeholder="Búsqueda"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />
      </div>

      {hasActiveFilters && (
        <>
          <div className="h-6 w-px bg-gray-200" />
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
          >
            <X className="w-4 h-4" />
            Limpiar Filtro
          </Button>
        </>
      )}
    </div>
  )
}
