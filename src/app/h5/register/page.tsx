"use client";
import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils";
export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = React.useState("85039485@qq.com");
  const [verifying, setVerifying] = React.useState(false);

  const [password, setPassword] = React.useState("");

  const [code, setCode] = React.useState("");
  const router = useRouter();

  // 处理注册表单的提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code,
      });
      console.log("handleSubmit===completeSignUp", completeSignUp);
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
           or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err) {
      console.error("Error:", err);
      const errmsg = getErrorMessage(err);
      if (errmsg.includes("is incorrect")) {
        alert("验证码错误");
      } else {
        alert(errmsg || "注册失败");
      }
    }
  };
  const getVerificationCode = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: email,
      });

      // Send the email with the verification code
      const codeRet = await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      console.log("codeRet", codeRet);
      setVerifying(true);
      alert("验证码已发送");
    } catch (err: any) {
      console.error("Error:", err);
      const errmsg = getErrorMessage(err);
      if (errmsg.includes("That email address is taken")) {
        alert("邮箱已被注册");
      } else {
        alert(errmsg || "验证码发送失败");
      }

      setVerifying(false);
    }
  };

  const handleSubmitByUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      // 开始使用提供的用户名和密码进行注册
      const completeSignUp = await signUp.create({
        username: email,
        password,
        redirectUrl: "/h5/index",
      });

      // 如果注册成功，设置会话为活跃状态
      // 并重定向用户
      //   const completeSignUp = await signUp.prepareEmailAddressVerification({});

      console.log("completeSignUp", completeSignUp);
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/h5/index");
      } else {
        // 如果状态不是完成，检查原因。用户可能需要
        // 完成进一步的步骤。
        console.error(JSON.stringify(completeSignUp, null, 2));
        const codeRet = await completeSignUp.attemptEmailAddressVerification({
          code: "123456",
        });
        console.log("codeRet", codeRet);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      alert(err.clerkError && err.errors[0].message);
    }
  };

  // 显示注册表单以捕获用户名和密码
  return (
    <div className="bg-gray-100  flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="relative w-80 rounded bg-white p-6 shadow-md"
      >
        <h2 className="mb-4 text-center text-lg font-bold">注册</h2>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setCode(e.target.value)}
              className="border-gray-300 mr-2 mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              required
            />
            <button
              type="button"
              disabled={verifying}
              onClick={getVerificationCode}
              className=" mt-1 w-20 rounded bg-blue-300 px-2 py-3 text-xs font-semibold
               text-white transition duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {verifying ? "已发送" : "验证码"}
            </button>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="border-blue box-content w-full rounded border-2 bg-blue-500 py-2 font-semibold text-white transition duration-200 hover:bg-blue-600"
          >
            注册
          </button>
          <button
            type="button"
            onClick={() => router.push("/h5/login")}
            className="mt-3 box-content w-full rounded border-2 border-solid border-blue-500 bg-white py-2 font-semibold text-black transition duration-200 hover:bg-blue-600"
          >
            去登录
          </button>
        </div>
      </form>
    </div>
  );
}
