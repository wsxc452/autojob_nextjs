import { signIn } from "@/auth";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";
import { CallbackRouteError } from "@auth/core/errors";
import { isNotFoundError } from "next/dist/client/components/not-found";
function handleServerActionError(error: any) {
  if (isRedirectError(error) || isNotFoundError(error)) {
    console.log("handleServerActionError isRedirectError error", error);
    throw error;
  }
}
export type UserType = {
  username: string;
  password: string;
};
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
