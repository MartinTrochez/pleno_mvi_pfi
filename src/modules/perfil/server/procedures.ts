import { db } from "@/db";
import { users } from "@/db/schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getTableColumns, and, eq } from "drizzle-orm";
import z from "zod";
import { updatePerfilSchema } from "../schemas";

export const perfilRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.void())
    .query(async ({ ctx }) => {
      const [existingUser] = await db
        .select({
          ...getTableColumns(users),
        })
        .from(users)
        .where(and(
          eq(users.tenant_id, ctx.auth.user.tenant_id),
          eq(users.id, Number(ctx.auth.user.id)),
        ))

      return existingUser;
    }),

  update: protectedProcedure
    .input(updatePerfilSchema)
    .mutation(async ({ ctx, input }) => {
      const [updatedUser] = await db
        .update(users)
        .set({
          name: input.nombres,
          last_name: input.apellidos,
          email: input.email,
        })
        .where(and(
          eq(users.tenant_id, ctx.auth.user.tenant_id),
          eq(users.id, Number(ctx.auth.user.id)),
        ))
        .returning();

      return updatedUser;
    }),
})
