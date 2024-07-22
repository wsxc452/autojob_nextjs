"use client";
import LoginForm from "./LoginForm";
import {
  useAuth,
  SignIn,
  SignedIn,
  UserButton,
  SignOutButton,
  useSignIn,
  useClerk,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Page() {
  const clerk = useClerk();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const router = useRouter();
  const { signIn, setActive } = useSignIn();
  // In case the user signs out while on the page.
  // if (!isLoaded || !userId) {
  //   // return (
  //   //   <div>
  //   //     <SignIn />
  //   //   </div>
  //   // );
  //   router.replace("/h5/index");
  // }

  useEffect(() => {
    // if (!isLoaded || !userId) {
    //   console.log("redirect");
    //   router.replace("/h5/login");
    // }
    if (isLoaded) {
      console.log("isLoaded", isLoaded);
      if (userId) {
        router.replace("/h5/index");
      }
    }
    console.log("userId----", userId);
  }, [isLoaded, userId, router]);
  async function onSubmit(values: any) {
    console.log("values", JSON.stringify(values));

    const email = values.username || "";
    const password = values.password || "";
    console.log("email", email, password);
    try {
      const signInAttempt = await clerk.client.signIn.create({
        identifier: email,
        password: password,
      });

      if (signInAttempt.status === "complete") {
        // 登录成功，设置活跃会话
        await clerk.setActive({
          session: signInAttempt.createdSessionId,
        });
        // 登录成功后跳转到首页
        router.push("/h5/index");
      } else {
        // 处理其他状态，例如需要二次验证等
        console.log("登录未完成:", signInAttempt);
      }
    } catch (err) {
      console.error("登录失败:", err);
    }
  }
  return (
    <div className="bg-gray-100 flex min-h-screen items-center justify-center">
      <form
        // onSubmit={handleSubmit}
        className="w-80 rounded bg-white p-6 shadow-md"
      >
        <h2 className="mb-4 text-center text-lg font-bold">简历投递助手</h2>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="text-gray-700 block text-sm font-medium"
          >
            输入邮箱
          </label>
          <input
            id="username"
            name="username"
            type="text"
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
            className="border-gray-300 mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="code"
            className="text-gray-700 block text-sm font-medium"
          >
            邮箱验证码
          </label>
          <div className="flex items-center justify-center">
            <input
              id="code"
              type="text"
              name="code"
              className="border-gray-300 mr-2 mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              required
            />
            <button
              type="button"
              className="mt-1 w-20 rounded bg-blue-300 px-2 py-3 text-xs font-semibold text-white transition duration-200 hover:bg-blue-600"
            >
              验证码
            </button>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full rounded bg-blue-500 py-2 font-semibold text-white transition duration-200 hover:bg-blue-600"
          >
            登陆
          </button>
          <button
            type="submit"
            onClick={() => router.push("/h5/register")}
            className="mt-5 w-full rounded bg-blue-300 py-2 font-semibold text-white transition duration-200 hover:bg-blue-600"
          >
            注册
          </button>
        </div>
      </form>
      {/* <LoginForm onSumbit={onSubmit} /> */}
    </div>
  );
}
