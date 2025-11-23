"use client"

import { useState } from "react"
import { Table } from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Filter, SearchIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TableFiltersProps<TData> {
  table: Table<TData>
  data: TData[]
}

export function TableFiltersStockProductos<TData>({ table, data }: TableFiltersProps<TData>) {
  const [searchValue, setSearchValue] = useState("")

  const cantidades = Array.from(new Set(data.map((item: any) => item.cantidad))).sort((a, b) => a - b)
  const categorias = Array.from(new Set(data.map((item: any) => item.categoria)))
  const prioridades = ["Alta", "Media", "Baja"]

  const handleSearch = (value: string) => {
    setSearchValue(value)
    table.getColumn("nombre")?.setFilterValue(value)
  }

  const handleCantidadFilter = (value: string) => {
    table.getColumn("cantidad")?.setFilterValue(value === "all" ? "" : value)
  }

  const handleCategoriaFilter = (value: string) => {
    table.getColumn("categoria")?.setFilterValue(value === "all" ? "" : value)
  }

  const handlePrioridadFilter = (value: string) => {
    table.getColumn("prioridad")?.setFilterValue(value === "all" ? "" : value)
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

      <div className="h-6 w-px bg-[#E5E5E5]" />

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-black" />
        <span className="text-sm text-black">Filtrar por:</span>
      </div>

      <Select onValueChange={handleCantidadFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Cantidad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Cantidad</SelectItem>
          {cantidades.map((cantidad) => (
            <SelectItem key={cantidad} value={cantidad.toString()}>
              Mayor a {cantidad}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleCategoriaFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {categorias.map((categoria) => (
            <SelectItem key={categoria} value={categoria}>
              {categoria}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handlePrioridadFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Prioridad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {prioridades.map((prioridad) => (
            <SelectItem key={prioridad} value={prioridad}>
              {prioridad}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
