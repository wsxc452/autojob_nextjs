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
