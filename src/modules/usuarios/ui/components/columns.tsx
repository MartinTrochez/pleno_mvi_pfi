"use client"
 
import { RoleType } from "@/constants"
import { ColumnDef } from "@tanstack/react-table"
import z from "zod"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
 
export type Usuarios = {
  id: number
  nombre: string
  apellido: string
  dni: number
  rol: RoleType,
}

const usuarioSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  apellido: z.string(),
  dni: z.number(),
  rol: z.string(),
})

export type Usuario = z.infer<typeof usuarioSchema>

export const columns: ColumnDef<Usuario>[] = [
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
    accessorKey: "apellido",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apellido" />
    ),
  },
  {
    accessorKey: "dni",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DNI" />
    ),
  },
  {
    accessorKey: "rol",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rol" />
    ),
  },
]
