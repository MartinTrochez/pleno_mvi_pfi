"use server"

import { auth } from "./auth";

export const createUser = async (data: any) => {
  const resp = await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/",
      dni: data.dni,
      tenant_id: data.tenan_id,
      last_name: data.last_name,
      role_type: "empleado",
      is_active: true,
      lang: "es",
    },
  });

  return resp
}
