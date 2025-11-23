import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { RoleType } from "@/constants";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return session;
};

export const requireAdminAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const Role: RoleType = "admin"

  if (!session) {
    redirect("/sign-in");
  }

  // console.log(session)
  console.log(session.user.role_type === Role)

  if (session.user.role_type === Role) {
    redirect("/sign-in");
  }

  return session;
};

export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
};
