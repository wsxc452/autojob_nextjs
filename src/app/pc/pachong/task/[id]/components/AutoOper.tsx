/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useMemo, useState } from "react";
import { useSnapshot } from "valtio";
import { Button } from "antd";
import pcStore, { userActions } from "@/app/pc/pcStates/pcStore";
import { useParams } from "next/navigation";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { getTaskInfos } from "@/service/task";
import message from "@/utils/antdMessage";
import { doIpc } from "@/app/pc/common/util";
import { TaskType } from "@/app/pc/common/types";
type UserBaseInfo = {
  userId: string;
  points: number;
};
export default function AutoOper() {
  const { id } = useParams();
  const { userInfo } = useSnapshot(pcStore);
  const [isRunning, setIsRunning] = useState(false);
  // const getTaskInfos(id);
  let errMsg = "";
  const { isOpended, isTaskEnd } = useSnapshot(pcStore);
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["taskInfos", id],
    queryFn: (_context: QueryFunctionContext) =>
      getTaskInfos(parseInt(id as string)),
    retry: 1,
  });

  const chromePath = useMemo(() => {
    // console.log("userInfo.configJson", userInfo.configJson);
    const chromeInfo = JSON.parse(userInfo.configJson || "{}");
    return chromeInfo.chromePath || "";
  }, [userInfo.configJson]);

  const doTest = async () => {
    console.log("doTest");
    const ret = await doIpc("task", { type: TaskType.Test });
    console.log("ret", ret);
  };
  // const {
  //   data: greetings,
  //   refetch,
  //   isLoading: greetingIsLoading,
  //   handleTableChange,
  // } = useGreetings(1, 10);
  // console.log("params", id);
  // if (!id) {
  //   throw new Error("id is required");
  // }

  useEffect(() => {
    if (!isLoading && data) {
      userActions.setCurrentTaskInfo(data.data.taskInfo);
    }
  }, [isLoading, data]);

  useEffect(() => {
    console.log("readdy......");
    setIsOpening(false);
    userActions.setIsOpended(false);
  }, []);

  const isCanStart = useMemo(() => {
    console.log("useMemo", data?.data, isLoading);

    const userInfo = data?.data?.userInfo || ({} as any);
    if (isLoading) {
      errMsg = "isLoading!";
      return false;
    }
    if (!userInfo) {
      errMsg = "userInfo is null! ";
      return false;
    }
    console.log(userInfo);
    if (chromePath === "") {
      errMsg = "请先配置chrome环境! ";
      return false;
    }

    const greetings = userInfo.greetings;
    console.log("greetings", greetings);
    if (greetings?.length == 0) {
      errMsg = "请先取后台配置招呼语! ";
      return false;
    } else if (userInfo.points <= 0) {
      errMsg = "当前用户余额不足!";
      return false;
    } else if (chromePath === "") {
      // 用户的chrome是否配置过
      errMsg = "请先配置chrome路径, 首页->tab页->浏览器配置!";
      return false;
    } else {
      errMsg = "";
    }

    return true;
  }, [data?.data, isLoading, userInfo.configJson]);

  const [isOpening, setIsOpening] = useState(false);
  const doInit = async (): Promise<void> => {
    console.log("isCanStart", isCanStart);

    console.log("isCanStart111");
    if (isOpening) {
      console.log("正在打开中...");
      return;
    }
    console.log("isCanStart111222");
    if (isOpended) {
      console.log("已经打开点击过页面");
      return;
    }

    userActions.clearLog();
    setIsOpening(true);
    const userInfo = data?.data.userInfo! || {};
    console.log("isCanStart111233322");
    if (chromePath === "") {
      message.error("请先配置chrome路径");
      setIsOpening(false);
      return;
    }
    const openRet = await doIpc("task", {
      type: TaskType.PaChongInit,
      chromePath: chromePath,
      taskId: id,
      userBaseInfo: {
        points: userInfo.points,
        userId: userInfo.userId,
      } as UserBaseInfo,
    });
    console.log("isCanStart11123332255");
    console.log("openRet", openRet);
    if (openRet.status) {
      setIsOpening(false);
      userActions.setIsOpended(true);
      message.success("打开页面成功");
    } else {
      setTimeout(() => {
        userActions.setIsOpended(false);
        setIsOpening(false);
        message.error(openRet.message || "打开页面失败");
        // setIsStarting(false);
      }, 1000);
    }
  };
  const doTask = (): void => {
    try {
      setIsRunning(true);
      userActions.setIsTaskEnd(false);
      doIpc("task", { type: TaskType.PaChongStart });
    } catch (e) {
      console.error(e);
      setIsRunning(false);
      // setIsStarting(false);
      userActions.setIsOpended(false);
    }
  };

  const doTaskClose = (): void => {
    try {
      doIpc("task", { type: TaskType.Stop });
      userActions.setIsOpended(false);
      setIsRunning(false);
    } catch (e) {
      console.error(e);
      // setIsStarting(false);
      setIsRunning(false);
      userActions.setIsOpended(false);
    }
  };
  return (
    <>
      <Button
        block
        loading={isLoading}
        type="primary"
        disabled={isOpening || isOpended}
        onClick={doInit}
      >
        第一步,打开页面
      </Button>

      <Button
        block
        type="primary"
        disabled={!isOpended || isRunning || isLoading}
        onClick={doTask}
      >
        第二步,执行抓取数据
      </Button>
      <Button
        block
        type="primary"
        disabled={!isOpended || isLoading || isTaskEnd}
        onClick={doTaskClose}
      >
        结束任务
      </Button>
      {/* <Button block type="primary" onClick={doTest}>
        test
      </Button> */}
    </>
  );
}
