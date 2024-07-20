import { signIn } from "@/auth";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";

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
    // if (isRedirectError(error)) {
    //   console.error(error);
    //   throw error;
    // }
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      // Handle validation errors
    } else {
      console.error("Unexpected error:", error);
      // Handle other errors
    }
    throw error;
  }
}