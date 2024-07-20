"use server";
import { signIn } from "@/auth";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";
import { CallbackRouteError } from "@auth/core/errors";
import { isNotFoundError } from "next/dist/client/components/not-found";
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

export async function loginAction(formData: FormData) {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validatedData = loginSchema.parse(rawFormData);
  console.log("Validated Data:", validatedData);
  try {
    await signIn("credentials", {
      redirect: false,
      redirectTo: "/dashboard",
      username: validatedData.email,
      password: validatedData.password,
    });
  } catch (error) {
    // console.error("loginAction error", error);
    throw "用户名密码错误";
  }
}
