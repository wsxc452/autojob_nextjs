"use client";
import { useEffect, useMemo, useState } from "react";
import { useSnapshot } from "valtio";
import { Button } from "antd";
import { doIpc } from "../../common/util";
import { useParams } from "next/navigation";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { getTask } from "@/service/task";
import message from "@/utils/antdMessage";
import { useGreetings } from "@/hooks/useGreetings";
import h5Store, { userActions } from "@/app/h5/h5/store/index";
import { TaskType } from "../../common/types";
export default function AutoOper() {
  const { id } = useParams();
  const [disable, setDisable] = useState(true);
  const [chromeInfo, setChromeIno] = useState({
    platform: "",
    chromePath: "",
  });
  let errMsg = "";
  const { userInfo, isOpended } = useSnapshot(h5Store);
  const isWithGreetings = true;
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["task", id, isWithGreetings],
    queryFn: (_context: QueryFunctionContext) =>
      getTask(parseInt(id as string), isWithGreetings),
    retry: 1,
  });

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
    const localStoreChromeInfo = localStorage.getItem("chromeInfo");
    if (localStoreChromeInfo) {
      const chromeInfo = JSON.parse(localStoreChromeInfo);
      setChromeIno({ ...chromeInfo });
    }
  }, []);

  const isCanStart = useMemo(() => {
    console.log("useMemo", data?.data.greetings, userInfo.points);
    if (!chromeInfo) {
      errMsg = "请先配置chrome环境! ";
      return false;
    }

    if (data?.data.greetings?.length == 0) {
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
    }
    errMsg = "";
    return true;
  }, [data?.data, userInfo.points, chromeInfo]);

  const [isOpening, setIsOpening] = useState(false);
  const doInit = async (): Promise<void> => {
    if (!isCanStart) {
      message.error(errMsg);
      return;
    }

    if (isOpended) {
      console.log("已经打开点击过页面");
      return;
    }

    userActions.clearLog();
    setIsOpening(true);

    const openRet = await doIpc("task", {
      type: TaskType.Init,
      ...chromeInfo,
    });
    if (openRet.status) {
      message.success("打开页面成功");
      userActions.setIsOpended(true);
    } else {
      setTimeout(() => {
        userActions.setIsOpended(false);
        // setIsStarting(false);
      }, 1000);
    }
  };
  const doTask = (): void => {
    try {
      doIpc("task", TaskType.Start);
    } catch (e) {
      console.error(e);
      // setIsStarting(false);
      userActions.setIsOpended(false);
    }
  };

  const doTaskClose = (): void => {
    userActions.setIsOpended(false);
    window.electron.ipcRenderer.send("task", TaskType.Stop);
  };
  return (
    <>
      <Button
        block
        loading={isLoading}
        type="primary"
        disabled={isOpening}
        onClick={doInit}
      >
        第一步,打开页面{!isCanStart ? "disabled" : "enable"}
      </Button>
      <Button
        block
        type="primary"
        disabled={!isOpended || isLoading}
        onClick={doTask}
      >
        第二步,开始投递任务
      </Button>
      <Button
        block
        type="primary"
        disabled={!isOpended || isLoading}
        onClick={doTaskClose}
      >
        结束任务
      </Button>
    </>
  );
}
