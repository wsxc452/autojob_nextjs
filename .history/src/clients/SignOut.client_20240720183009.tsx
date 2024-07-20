"use client";
import { signIn } from "next-auth/react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

export default function SignOutClient() {
  const router = useRouter();

  const handleLogin = async () => {
    console.log("handleLogin");
    try {
      const ret: any = await signIn("credentials", {
        redirect: true,
        username: "wsxc451",
        password: "xiaocao11",
      });
      console.log("ret=====", ret);
      if (ret.error) {
        console.error("ret.error=====", ret.error);
        alert("登录失败" || ret.error);
      } else {
        console.log("revalidatePath=====", router);
        router.replace("/");
      }
    } catch (e) {
      console.log("handleLogin error", e);
    }
  };
  return (
    <input
      type="submit"
      onClick={handleLogin}
      value="Sign In"
      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
    />
  );
}
