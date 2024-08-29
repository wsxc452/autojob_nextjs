"use client";
import { useEffect, useMemo, useState } from "react";
import { useSnapshot } from "valtio";
import { Button } from "antd";
import { doIpc } from "../../common/util";
import { useParams } from "next/navigation";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { getTask, getTaskInfos } from "@/service/task";
import message from "@/utils/antdMessage";
import h5Store, { userActions } from "@/app/h5/h5/store/index";
import { TaskType } from "../../common/types";

type UserBaseInfo = {
  userId: string;
  points: number;
};
export default function AutoOper() {
  const { id } = useParams();
  const [isRunning, setIsRunning] = useState(false);
  // const getTaskInfos(id);
  const [chromeInfo, setChromeIno] = useState({
    platform: "",
    chromePath: "",
  });
  let errMsg = "";
  const { isOpended, isTaskEnd } = useSnapshot(h5Store);
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["taskInfos", id],
    queryFn: (_context: QueryFunctionContext) =>
      getTaskInfos(parseInt(id as string)),
    retry: 1,
  });

  // const doTest = async () => {
  //   console.log("doTest");
  //   const ret = await doIpc("task", { type: TaskType.Test });
  //   console.log("ret", ret);
  // };
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
    const localStoreChromeInfo = localStorage.getItem("chromeInfo");
    if (localStoreChromeInfo) {
      const chromeInfo = JSON.parse(localStoreChromeInfo);
      setChromeIno({ ...chromeInfo });
    }
  }, []);

  const isCanStart = useMemo(() => {
    console.log("useMemo", data?.data, isLoading);

    const userInfo = data?.data?.userInfo || ({} as any);
    if (isLoading) {
      errMsg = "isLoading! ";
      return false;
    }
    if (!userInfo) {
      errMsg = "userInfo is null! ";
      return false;
    }
    console.log(userInfo);
    if (!chromeInfo) {
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
    } else if (chromeInfo.chromePath === "" || chromeInfo.chromePath === null) {
      // 用户的chrome是否配置过
      errMsg = "请先配置chrome路径!";
      return false;
    } else if (chromeInfo.platform === "" || chromeInfo.platform === null) {
      // 用户的chrome是否配置过
      errMsg = "请先配置平台类型!";
      return false;
    } else {
      errMsg = "";
    }

    return true;
  }, [data?.data, isLoading, chromeInfo]);

  const [isOpening, setIsOpening] = useState(false);
  const doInit = async (): Promise<void> => {
    console.log("isCanStart", isCanStart);
    // if (!isCanStart) {
    //   message.error(errMsg);
    //   return;
    // }
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
    const openRet = await doIpc("task", {
      type: TaskType.Init,
      ...chromeInfo,
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
      doIpc("task", { type: TaskType.Start });
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
        第二步,开始投递任务 ID:{id} 投递量{data?.data?.taskInfo?.maxCount || 0}
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
