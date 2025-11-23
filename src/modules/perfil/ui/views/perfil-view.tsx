"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User2Icon } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { cn } from "../../../../lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const perfilSchema = z.object({
  nombres: z.string().trim().min(1, "Ingrese sus nombres"),
  apellidos: z.string().trim().min(1, "Ingrese sus apellidos"),
  email: z.string().email("Email inválido"),
  rol: z.string(),
  dni: z.number(),
});

export type PerfilFormValues = z.infer<typeof perfilSchema>;

export const PerfilView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.perfil.get.queryOptions());

  const defaultValues: PerfilFormValues = {
    nombres: data.name,
    apellidos: data.last_name,
    email: data.email,
    rol: data.role_type ?? '',
    dni: data.dni,
  };

  const form = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { ...defaultValues },
    mode: "onBlur",
  });

  return (
    <div className={cn("p-6 md:p-8")}>
      <div className="space-y-6 max-w-6xl mx-auto w-full">
        <h1 className="text-xl font-semibold tracking-tight">Perfil</h1>
        <div className="bg-background border rounded-xl shadow-sm p-8 max-w-3xl mx-auto w-full">
          <div className="flex flex-col items-center mb-8">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <User2Icon className="size-7 text-muted-foreground" />
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={() => {}}
              className="grid gap-8 max-w-2xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <FormField<PerfilFormValues>
                  control={form.control}
                  name="nombres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<PerfilFormValues>
                  control={form.control}
                  name="apellidos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField<PerfilFormValues>
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<PerfilFormValues>
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <Input role="number" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<PerfilFormValues>
                  control={form.control}
                  name="rol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PerfilView;
