import { Spin } from "antd";
import CardWrap from "../common/CardWrap";
import { auth } from "@clerk/nextjs/server";
import LoginForm from "./LoginForm";
import { Suspense, useEffect } from "react";
import globaStore from "@/states/globaStore";
import { redirect, RedirectType } from "next/navigation";
export default function Page() {
  const authInfo = auth();
  console.log("userId", authInfo);

  if (authInfo?.userId) {
    redirect("/h5/index", RedirectType.replace);
    return null;
  }
  globaStore.userInfo = {
    name: "test",
    email: "wsx ",
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
