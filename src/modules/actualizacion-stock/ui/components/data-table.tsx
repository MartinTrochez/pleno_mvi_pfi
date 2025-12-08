"use client"
import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableFilters } from "./data-filter"

type OnStockUpdateHandler = (productId: number, adjustment: number | null) => void

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onStockUpdate?: OnStockUpdateHandler
  pendingAdjustments?: Record<number, number>
  onSaveChanges?: () => void
  onDiscardChanges?: () => void
  isSaving?: boolean
}

type DataTableMeta = {
  onStockUpdate?: OnStockUpdateHandler
  pendingAdjustments?: Record<number, number>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onStockUpdate,
  pendingAdjustments,
  onSaveChanges,
  onDiscardChanges,
  isSaving = false,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      columnFilters,
      pagination,
    },
    meta: {
      onStockUpdate,
      pendingAdjustments,
    } as DataTableMeta,
  })

  const firstRow = pagination.pageIndex * pagination.pageSize + 1
  const lastRow = Math.min(firstRow + table.getRowModel().rows.length - 1, table.getRowCount())
  const hasPendingAdjustments = Boolean(pendingAdjustments && Object.keys(pendingAdjustments).length > 0)


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center min-w-6xl">
        <TableFilters table={table} data={data} />
        <div className="space-x-4">
          <Button
            onClick={() => onSaveChanges?.()}
            disabled={!hasPendingAdjustments || isSaving}
          >
            Guardar Cambios
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDiscardChanges?.()}
            disabled={!hasPendingAdjustments || isSaving}
          >
            Descartar Cambios
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-[#FCFDFD]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="bg-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No hay resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm text-[#B5B6BA]">
        <div className="flex-1 text-center">
          Mostrando {firstRow}-{lastRow} de {table.getRowCount().toLocaleString()} productos
        </div>

        <div className="flex items-center border rounded-md overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-none border-r bg-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-none border-r bg-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}