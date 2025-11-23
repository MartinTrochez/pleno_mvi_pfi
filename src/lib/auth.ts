import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schemas from "@/db/schemas";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schemas
    }
  }),
  emailAndPassword: {
    enabled: true
  },
  advanced: {
    database: {
      useNumberId: true,
    },
  },
  user: {
    modelName: "users",
    userPasswordField: "password_hash",
    additionalFields: {
      tenant_id: {
        type: "number",
        required: true
      },
      last_name: {
        type: "string",
        required: true
      },
      dni: {
        type: "number",
        required: true
      },
      role_type: {
        type: "string",
        required: false,
        defaultValue: "empleado"
      },
      is_active: {
        type: "boolean",
        required: false,
        defaultValue: true
      },
      last_login: {
        type: "date",
        required: false
      },

      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false
      },
      lang: {
        type: "string",
        required: false,
        defaultValue: "en"
      }
    }
  },
});

