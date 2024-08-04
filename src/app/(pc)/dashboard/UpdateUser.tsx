"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { useEffect } from "react";
import { syncItem } from "@/service/users";
import { UserInfo } from "@/types";
import { Users } from "@prisma/client";

export default function UpdateUser() {
  const { user, isLoaded } = useUser();
  console.log(user);
  async function syncUser(userInfo: Partial<Users>) {
    try {
      const ret = await syncItem(userInfo);
      console.log(ret);
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    if (isLoaded && user) {
      console.log(user);
      syncUser({
        username: user.fullName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
        // avatar: user.imageUrl || "",
        userId: user.id || "",
        dId: "1",
      }).then(() => {
        console.log("synced");
      });
    }
  }, [user, isLoaded]);
  return <div>....update</div>;
}
