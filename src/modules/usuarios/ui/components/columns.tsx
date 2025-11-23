"use client"
 
import { RoleType } from "@/constants"
import { ColumnDef } from "@tanstack/react-table"
import z from "zod"
 
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
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "apellido",
    header: "Apellido",
  },
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    accessorKey: "rol",
    header: "Rol",
  },
]
