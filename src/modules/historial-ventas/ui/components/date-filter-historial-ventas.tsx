"use client"

import { useState } from "react"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, X } from "lucide-react"
import {
  subWeeks,
  subMonths,
  isWithinInterval,
  startOfDay,
  endOfDay,
  format,
  isSameDay,
} from "date-fns"
import { es } from "date-fns/locale"

interface DateFiltersProps<TData> {
  table: Table<TData>
  dateColumn: string
}

export function DateFilters<TData>({ table, dateColumn }: DateFiltersProps<TData>) {
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  })

  const today = startOfDay(new Date())

  const quickFilters = [
    { label: "Última semana", range: { from: subWeeks(today, 1), to: today } },
    { label: "Último mes", range: { from: subMonths(today, 1), to: today } },
    { label: "Últimos 3 meses", range: { from: subMonths(today, 3), to: today } },
  ]

  const applyDateFilter = (from: Date | null, to: Date | null) => {
    setDateRange({ from, to })
    table.getColumn(dateColumn)?.setFilterValue(from && to ? { from: startOfDay(from), to: endOfDay(to) } : undefined)
  }

  const column = table.getColumn(dateColumn)
  if (column && !column.columnDef.filterFn) {
    column.columnDef.filterFn = (row, columnId, filterValue) => {
      if (!filterValue) return true

      const rowValue = row.getValue(columnId)
      const cellDate = rowValue instanceof Date ? rowValue : new Date(rowValue as string)

      const { from, to } = filterValue as { from: Date; to: Date }
      if (!from || !to) return true

      return isWithinInterval(cellDate, {
        start: from,
        end: to
      })
    }
  }

  const hasActiveFilter = dateRange.from && dateRange.to
  
  return (
    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border">
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-4 h-4 text-black" />
        <span className="text-sm text-black">Filtrar por fecha:</span>
      </div>
      
       <div className="flex items-center gap-2">
         {quickFilters.map((filter) => (
           <Button
             key={filter.label}
             variant="outline"
             onClick={() => applyDateFilter(filter.range.from, filter.range.to)}
             className={`text-sm ${
               dateRange.from && isSameDay(dateRange.from, filter.range.from) ? "bg-gray-100" : ""
             }`}
           >
             {filter.label}
           </Button>
         ))}
       </div>
      
      <div className="h-6 w-px bg-[#E5E5E5]" />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-sm flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            {hasActiveFilter && dateRange.from && dateRange.to
              ? `${format(dateRange.from, "dd MMM", { locale: es })} - ${format(dateRange.to, "dd MMM", { locale: es })}`
              : "Seleccionar rango"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-2 w-auto">
          <Calendar
            mode="range"
            selected={
              dateRange.from && dateRange.to
                ? { from: dateRange.from, to: dateRange.to }
                : undefined
            }
            onSelect={(range) => {
              if (range?.from && range?.to) {
                applyDateFilter(range.from, range.to)
              }
            }}
            locale={es}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      
      {hasActiveFilter && (
        <>
          <div className="h-6 w-px bg-[#E5E5E5]" />
          <Button
            variant="ghost"
            onClick={() => applyDateFilter(null, null)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
          >
            <X className="w-4 h-4" />
            Limpiar
          </Button>
        </>
      )}
    </div>
  )
}
