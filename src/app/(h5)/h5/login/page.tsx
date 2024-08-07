import { Spin } from "antd";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import globaStore from "@/states/globaStore";
import { redirect, RedirectType } from "next/navigation";
import CardWrap from "../common/CardWrap";
import LoginForm from "./LoginForm";
export default function Page() {
  const authInfo = auth();
  console.log("userId", authInfo);

  if (authInfo?.userId) {
    redirect("/h5/index", RedirectType.replace);
  }
  globaStore.userInfo = {
    name: "",
    email: "",
    avatar: "",
    id: authInfo?.userId || "",
  };

  return (
    <CardWrap>
      <Spin tip="Loading..." spinning={false}>
        <Suspense fallback={<div>loading...</div>}>
          <LoginForm globaStore={globaStore} />
        </Suspense>
      </Spin>
    </CardWrap>
  );
}
