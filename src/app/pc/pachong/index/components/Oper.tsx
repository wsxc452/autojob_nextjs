"use client";
import { TaskType } from "@/app/pc/common/types";
import { doIpc } from "@/app/pc/common/util";
import pcStore, { userActions } from "@/app/pc/pcStates/pcStore";
import message from "@/utils/antdMessage";
import { Button } from "antd";
import { useMemo } from "react";
import { useSnapshot } from "valtio";
type UserBaseInfo = {
  userId: string;
  points: number;
};
function PaChongOper() {
  const { userInfo } = useSnapshot(pcStore);
  let errMsg = "";
  const chromePath = useMemo(() => {
    // console.log("userInfo.configJson", userInfo.configJson);
    const chromeInfo = JSON.parse(userInfo.configJson || "{}");
    return chromeInfo.chromePath || "";
  }, [userInfo.configJson]);

  const isCanStart = useMemo(() => {
    if (chromePath === "") {
      errMsg = "请先配置chrome环境! ";
      return false;
    }

    return true;
  }, [chromePath]);

  const handleClick = async () => {
    console.log("init pachong");
    console.log("doTest");

    if (chromePath === "") {
      message.error("请先配置chrome路径");
      return;
    }
    const openRet = await doIpc("task", {
      type: TaskType.PaChongInit,
      chromePath: chromePath,
      taskId: 2,
      userBaseInfo: {
        points: userInfo.points,
        userId: userInfo.userId,
      } as UserBaseInfo,
    });
    console.log("isCanStart11123332255");
    console.log("openRet", openRet);
  };

  const startHandler = async () => {
    console.log("start pachong");
    const openRet = await doIpc("task", {
      type: TaskType.PaChongStart,
    });
    console.log("openRet", openRet);
  };
  return (
    <div>
      <div>
        <Button onClick={handleClick}>打开页面 </Button>
        <Button onClick={startHandler}>开始抓取 </Button>
      </div>
    </div>
  );
}

export default PaChongOper;
