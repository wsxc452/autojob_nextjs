import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <SignUp signInUrl="/pc/auth/sign-in" />
    </div>
  );
}
