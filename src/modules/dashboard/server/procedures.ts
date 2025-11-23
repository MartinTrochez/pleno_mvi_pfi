import { db } from "@/db";
import { eq, getTableColumns, and } from "drizzle-orm";
import { tenants, users } from "@/db/schemas";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const tenantNameRouter = createTRPCRouter({
  getTenantName: protectedProcedure
    .input(z.void())
    .query(async ({ ctx }) => {
      const [existingTenant] = await db
        .select({
          ...getTableColumns(tenants),
        })
        .from(tenants)
        .where(and(eq(tenants.id, ctx.auth.user.tenant_id)));

      if (!existingTenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant Name not found" });
      }

      return existingTenant.name;
    }),
});

