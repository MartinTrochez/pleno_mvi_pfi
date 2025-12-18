import z from "zod";

export const perfilSchema = z.object({
  nombres: z.string().trim().min(1, "Ingrese sus nombres"),
  apellidos: z.string().trim().min(1, "Ingrese sus apellidos"),
  email: z.string().email("Email inválido"),
  rol: z.string(),
  dni: z.number(),
});

export const updatePerfilSchema = z.object({
  nombres: z.string().trim().min(1, "Ingrese sus nombres"),
  apellidos: z.string().trim().min(1, "Ingrese sus apellidos"),
  email: z.string().email("Email inválido"),
});

export type PerfilType = z.infer<typeof perfilSchema>;
export type UpdatePerfilType = z.infer<typeof updatePerfilSchema>;
