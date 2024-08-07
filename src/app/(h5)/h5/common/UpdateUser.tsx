"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { useEffect } from "react";
import { syncItem } from "@/service/users";
import { Users } from "@prisma/client";
import { userActions } from "@/app/h5/h5/store/index";

function getOS() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS X")) {
    return "macOS";
  } else if (userAgent.includes("Windows NT")) {
    return "Windows";
  } else {
    return "Other";
  }
}
export default function UpdateUser() {
  const { user, isLoaded } = useUser();

  async function syncUser(userInfo: Partial<Users>) {
    try {
      const ret = await syncItem(userInfo);
      console.log(ret);
      if (ret) {
        userActions.setUserInfo(ret.data);
      }
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    if (isLoaded && user) {
      syncUser({
        userName: user.username || "",
        email: user.emailAddresses[0]?.emailAddress || "",
        avatar: user.imageUrl || "",
        userId: user.id || "",
        fullName: user.fullName || "",
        lastName: user.lastName || "",
        firstName: user.firstName || "",
      });
    }
  }, [user, isLoaded]);

  // useEffect(() => {
  //   const os = getOS();
  //   console.log("os==", os);
  // }, []);
  return <></>;
}
