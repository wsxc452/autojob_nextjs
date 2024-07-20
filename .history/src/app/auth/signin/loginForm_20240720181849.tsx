"use client";
import SignOutClient from "@/clients/SignOut.client";
import { useFormState } from "react-dom";
import { loginAction } from "@/actions/loginAction";
import { isRedirectError } from "next/dist/client/components/redirect";
import { isNotFoundError } from "next/dist/client/components/not-found";
export default function LoginForm({}) {
  async function loginFormAction(formData: any) {
    await loginAction(formData);
  }
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("credentials", formData);
      }}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}
