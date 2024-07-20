import { signIn } from "@/auth";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";
import { CallbackRouteError } from "@auth/core/errors";

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
  "use server";
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
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
    // mutate data
    // revalidate cache
  } catch (error) {
    if (isRedirectError(error)) {
      console.error(error);
      throw new CallbackRouteError("用户名密码错误1");
    } else if (error instanceof CallbackRouteError) {
      throw new CallbackRouteError("用户名密码错误2");
    } else if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      // Handle validation errors
      throw new CallbackRouteError("用户名密码错误3");
    } else {
      console.error("Unexpected error:", error);
      // Handle other errors
      // throw new CallbackRouteError("用户名密码错误4");
      throw Error("用户名密码错误4");
    }
  }
}
