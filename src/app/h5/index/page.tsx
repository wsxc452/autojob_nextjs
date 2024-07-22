"use client";

import { useClerk, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import LogoutClient from "./logout";

export default function H5Index() {
  // const { signOut } = useClerk();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const freshUser = function () {
    // window.location.reload();
    console.log("freshUser", isLoaded, userId, sessionId, getToken);
  };
  console.log("H5Index====", isLoaded, isLoaded, userId, sessionId);

  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return <h1 onClick={freshUser}>not found</h1>;
  }

  console.log("user", userId, sessionId);
  // if (!isLoaded || !userId) {
  //   console.log("redirect");
  //   // router.replace("/h5/login");
  //   return;
  // }

  // useEffect(() => {
  //   console.log("userId====", userId);
  //   if (isLoaded && !userId) {
  //     getToken().then((token) => {
  //       console.log("token", token);
  //       console.log("userId====", isLoaded, userId);
  //     });
  //     // router.replace("/h5/login");
  //     // setTimeout(() => {
  //     //   console.log("isSignedIn");
  //     //   window.location.reload();
  //     // }, 2000);
  //   }
  // }, [isLoaded, userId, getToken]);

  // if (!isLoaded) {
  //   return <p>加载中...</p>; // 等待用户信息加载
  // }

  // if (!isSignedIn) {
  //   return <p>您尚未登录，请先登录。</p>; // 用户未登录
  // }

  // if (!user) {
  //   return <p>用户信息不可用。</p>; // 用户信息为空
  // }

  // useEffect(() => {
  //   if (isLoaded) {
  //     if (!userId) {
  //       getToken().then((token) => {
  //         console.log("token", token);
  //       });
  //       //   router.replace("/h5/login");
  //     }
  //   }
  //   console.log("H5Index22222----", isLoaded, userId);
  // }, [isLoaded, userId, getToken]);

  const logout = async () => {
    // console.log("logout");
    // const ret = await signOut({
    //   redirectUrl: "/h5/login",
    // });
    // console.log("ret", ret);
  };
  return (
    <div>
      H5index {JSON.stringify({ userId, sessionId })}
      <LogoutClient />
    </div>
  );
}
