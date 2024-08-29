"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { useEffect } from "react";
import { syncItem } from "@/service/users";
import { Users } from "@prisma/client";
import { userActions } from "@/app/pc/pcStates/pcStore";

export default function UpdateUser() {
  const { user, isLoaded } = useUser();
  async function syncUser(userInfo: Partial<Users>) {
    try {
      const ret = await syncItem(userInfo);
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
  return <></>;
}
