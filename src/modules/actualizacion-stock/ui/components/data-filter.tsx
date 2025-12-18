"use client";

import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchShortcut } from "@/hooks/use-searchbar-shortcut";

interface TableFiltersProps<TData> {
  table: Table<TData>;
  data: TData[];
}

export function TableFilters<TData>({ table, data }: TableFiltersProps<TData>) {
  const [searchValue, setSearchValue] = useState("");
  const isMac = navigator.userAgent.includes("Mac");

const handleSearch = (value: string) => {
    setSearchValue(value);
    table.setGlobalFilter(value);
  };

  const searchRef = useSearchShortcut();

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
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 
            text-xs text-muted-foreground font-mono bg-muted px-1 rounded"
          >
            {isMac ? "⌘K" : "Ctrl+K"}
          </span>
        </div>
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
  );
}
