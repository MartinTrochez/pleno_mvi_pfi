"use client";

import {
  columns,
  Usuario,
} from "@/modules/usuarios/ui/components/columns";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataPaginationUsuarios } from "../components/data-pagination-usuarios";
import { useUsuariosFilters } from "../../hooks/use-usuarios-filter";
import { DataTableUsuarios } from "../components/data-table-usuarios";

export const UsuariosView = () => {
  const [filters, setFilters] = useUsuariosFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.usuarios.getMany.queryOptions({
      ...filters,
    }),
  );
  const usuarios = data.items.map((item) => ({
    id: item.id,
    nombre: item.name,
    apellido: item.last_name,
    dni: item.dni,
    rol: item.role_type,
  })) as Usuario[];

  return (
    <div className="flex-col items-center">
      <h1 className="pt-8 pl-8 text-xl text-black font-bold">Usuarios</h1>
      <div className="p-8 space-y-4">
        <DataTableUsuarios data={usuarios} columns={columns} />
        <DataPaginationUsuarios
          page={filters.page}
          totalPages={data.totalPages}
          onPageChange={(page) => setFilters({ page })}
        />
      </div>
    </div>
  );
};
