"use client";

import { useClerk, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Flex } from "antd";
import globaStore from "@/states/globaStore";
import { useSnapshot } from "valtio";
import message from "@/utils/antdMessage";
import { arCall } from "@/utils";

function closeApp() {
  arCall("closeApp");
}

function test() {
  arCall("toast", {
    message: "测试弹窗",
    duration: 2000,
  });
}

export default function H5Index() {
  const { signOut } = useClerk();
  const { isLoaded, user } = useUser();
  const router = useRouter();

  const userInfo = useSnapshot(globaStore).userInfo;

  useEffect(() => {
    console.log("isLoaded", isLoaded, user);
    if (isLoaded) {
      if (!user) {
        router.replace("/h5/login");
      }
    }
  }, [isLoaded, user, router]);

  function doTask() {
    console.log(userInfo);

    const taskInfo = {
      taskKey: "postTask",
      data: {
        name: userInfo.name,
        email: userInfo.email,
        id: userInfo.id,
      },
    };
    arCall("globalStore", taskInfo);
  }

  const logout = async () => {
    console.log("logout");
    try {
      const ret = await signOut({
        redirectUrl: "/h5/login",
      });
      console.log("ret", JSON.stringify(ret));
      // router.replace("/h5/login");
    } catch (e) {
      console.log("logout error", e);
      message.info("logout error");
    }
  };
  return (
    <div>
      <div className="p-5 text-center text-lg">欢迎 {user?.fullName}</div>
      <Flex vertical gap="large" style={{ width: "100%", padding: "15px" }}>
        <Button size="large" onClick={doTask} type="primary" block>
          启动任务
        </Button>

        <Button size="large" onClick={logout} type="primary" danger block>
          账号退出
        </Button>
        <Button size="large" onClick={test} type="primary" danger block>
          测试弹窗
        </Button>
        <Button size="large" onClick={closeApp} type="primary" danger block>
          关闭软件
        </Button>
      </Flex>
    </div>
  );
}
