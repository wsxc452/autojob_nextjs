import SignOutClient from "@/clients/SignOut.client";
import { useFormState } from "react-dom";
import { loginAction } from "@/actions/loginAction";
import { isRedirectError } from "next/dist/client/components/redirect";
import { isNotFoundError } from "next/dist/client/components/not-found";
import { signIn } from "@/auth";

export default function LoginForm({}) {
  return (
    <form
      action={async (formData) => {
        "use server";
        const ret = await signIn("credentials", formData);
        console.log(ret);
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
