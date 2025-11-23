import { requireUnauth } from "@/lib/auth-utils";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

export default async function SignInPage() {
  await requireUnauth()

  return (
    <SignInView />
  )
}
