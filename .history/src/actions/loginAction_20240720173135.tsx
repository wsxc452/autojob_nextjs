import { signIn } from "@/auth";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";
import { CallbackRouteError } from "@auth/core/errors";
import { isNotFoundError } from "next/dist/client/components/not-found";
export async function loginAction(formData: FormData) {
  "use server";
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validatedData = loginSchema.parse(rawFormData);
  console.log("Validated Data:", validatedData);
  // const ret = await signIn("credentials", {
  //   redirect: true,
  //   email: validatedData.email,
  //   password: validatedData.password,
  // });

  await signIn("credentials", {
    redirect: true,
    redirectTo: "/dashboard",
    username: validatedData.email,
    password: validatedData.password,
  });
}
