import { db } from "@/db";
import { eq, getTableColumns, and, desc, asc, count } from "drizzle-orm"
import { users } from "@/db/schemas";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const usuariosRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(z.object({
      page: z.number().default(DEFAULT_PAGE),
      pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    }))
    .query(async ({ input, ctx }) => {
      const { page, pageSize } = input

      const data = await db
        .select({
          ...getTableColumns(users),
        })
        .from(users)
        .where(and(
          eq(users.tenant_id, ctx.auth.user.tenant_id),
        ))
        .orderBy(asc(users.id))
        .limit(pageSize).offset((page - 1) * pageSize)

      const [total] = await db
        .select({ count: count() })
        .from(users)
        .where(and(
          eq(users.tenant_id, ctx.auth.user.tenant_id),
        ))

      const totalPages = Math.ceil(total.count / pageSize)

      return {
        items: data,
        total: total.count,
        totalPages,
      }
    }),
});

