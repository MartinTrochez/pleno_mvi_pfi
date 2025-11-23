import { db } from "@/db";
import { eq, getTableColumns, and } from "drizzle-orm";
import { users } from "@/db/schemas";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";

export const createAccountRouter = createTRPCRouter({
  getUser: baseProcedure
    .input(z.object({ dni: z.number().nonnegative().min(9) }))
    .query(async ({ input }) => {
      const [existingUser] = await db
        .select({
          ...getTableColumns(users),
        })
        .from(users)
        .where(and(eq(users.dni, input.dni)));

      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }

      return existingUser.name;
    }),
});

