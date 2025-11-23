import { db } from "@/db";
import { users } from "@/db/schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getTableColumns, and, eq } from "drizzle-orm";
import z from "zod";

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
})
