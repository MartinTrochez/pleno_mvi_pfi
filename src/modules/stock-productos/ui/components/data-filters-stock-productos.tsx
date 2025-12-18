"use client";

import { useEffect, useRef, useState } from "react";
import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableFiltersProps<TData> {
  table: Table<TData>;
  data: TData[];
}

export function TableFiltersStockProductos<TData>({
  table,
  data,
}: TableFiltersProps<TData>) {
  const [searchValue, setSearchValue] = useState("");
  const isMac = navigator.userAgent.includes("Mac");
  const searchRef = useRef<HTMLInputElement>(null);

  const cantidades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const categorias = Array.from(
    new Set(data.map((item: any) => item.categoria)),
  );
  const prioridades = ["Alta", "Media", "Baja"];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    table.setGlobalFilter(value);
  };

  const handleCantidadFilter = (value: string) => {
    table.getColumn("cantidad")?.setFilterValue(value === "all" ? "" : value);
  };

  const handleCategoriaFilter = (value: string) => {
    table.getColumn("categoria")?.setFilterValue(value === "all" ? "" : value);
  };

  const handlePrioridadFilter = (value: string) => {
    table.getColumn("prioridad")?.setFilterValue(value === "all" ? "" : value);
  };

  const clearFilters = () => {
    setSearchValue("");
    table.resetColumnFilters();
    table.setGlobalFilter("");
  };

  const hasActiveFilters =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter;

  return (
    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border">
      <div className="flex items-center gap-2 flex-1">
        <SearchIcon className="text-[#A4A4A5]" />
        <div className="relative w-full">
          <Input
            ref={searchRef}
            placeholder="Búsqueda"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-12"
          />

          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 
                   text-xs text-muted-foreground font-mono bg-muted px-1 rounded"
          >
            {isMac ? "⌘K" : "Ctrl+K"}
          </span>
        </div>
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
  );
}
