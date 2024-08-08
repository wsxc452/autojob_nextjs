"use client";

import { useClerk } from "@clerk/nextjs";
import { use, useEffect, useLayoutEffect, useState } from "react";
import { Button, Flex } from "antd";
import globaStore from "@/states/globaStore";
import { useSnapshot } from "valtio";
import message from "@/utils/antdMessage";
import { arCall } from "@/utils";
import "./page.css";
import AutoOper from "../common/AutoOper";
import Versions from "../common/Versions";
import LogList from "../common/LogList";
import registerEvents from "../../common/registerRenderer";
import { getList } from "@/service/greetings";
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
  // const { isLoaded, user } = useUser();
  const [isOuting, setIsOuting] = useState(false);

  const userInfo = useSnapshot(globaStore).userInfo;

  function doTask() {
    console.log(userInfo);
    window.electron.ipcRenderer.send("go", "type");
    // const taskInfo = {
    //   taskKey: "postTask",
    //   data: {
    //     name: userInfo.name,
    //     email: userInfo.email,
    //     id: userInfo.id,
    //   },
    // };
    // arCall("startSearch", taskInfo);
  }

  const logout = async () => {
    console.log("logout");
    if (isOuting) {
      return;
    }
    setIsOuting(true);
    try {
      await signOut({
        redirectUrl: "/h5/login",
      });
      // @ts-ignore
      if (window.airscript) {
        arCall("closeApp");
      }

      // router.replace("/h5/login");
    } catch (e) {
      console.log("logout error", e);
      message.info("logout error");
      setIsOuting(false);
    }
  };
  function goFn(arg0: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div className="page flex h-full w-full flex-col items-center justify-center overflow-hidden !bg-sky-400 px-5">
        {/* <div className="my-5 flex w-full flex-row  justify-between gap-5">
          <Button onClick={() => goFn("back")}>返回</Button>
          <Button onClick={() => goFn("reload")}>刷新</Button>
          <Button onClick={() => goFn("forward")}>前进</Button>
        </div> */}
        <div className="flex h-[130px] w-full flex-col  items-center gap-3 rounded-lg text-sm">
          <AutoOper />
        </div>
        <div className="my-5 w-full flex-1 overflow-hidden rounded bg-white bg-opacity-70 p-3">
          <LogList />
        </div>
        <div className="flex h-[80px] w-full  flex-row  text-white">
          <Versions />
        </div>
      </div>
    </>
  );
}
