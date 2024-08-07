import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { Button } from "antd";
import { TaskType } from "../../common/types";
import store, { userActions } from "@/states/globaStore";
import useCountdown from "./useCountdown";
import { doIpc } from "../../common/util";
import { useParams } from "next/navigation";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { getTask } from "@/service/task";

export default function AutoOper() {
  const { id } = useParams();
  console.log("params", id);
  if (!id) {
    throw new Error("id is required");
  }
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["task", id],
    queryFn: (_context: QueryFunctionContext) =>
      getTask(parseInt(id as string)),
    retry: 1,
  });
  if (isError) {
    throw error;
  }

  console.log("task", data);
  const { isOpended } = useSnapshot(store);
  // const [isOpened, setIsOpened] = useState(globalStore.isOpened);
  // const { count, start, pause, reset, go, isActive } = useCountdown(5, () => {
  //   // setVerifying(false);
  //   doInit();
  // });

  const [isStarting, setIsStarting] = useState(false);
  const doInit = (): void => {
    if (isOpended) {
      console.log("已经打开点击过页面");
      return;
    }
    userActions.setIsOpended(true);
    userActions.clearLog();
    setIsStarting(true);
    try {
      doIpc("task", TaskType.Init);
    } catch (e) {
      console.error(e);
      setTimeout(() => {
        userActions.setIsOpended(false);
        setIsStarting(false);
      }, 1000);
    }
  };
  const doTask = (): void => {
    try {
      doIpc("task", TaskType.Start);
    } catch (e) {
      console.error(e);
      setIsStarting(false);
      userActions.setIsOpended(false);
    }
  };

  useEffect(() => {
    // 根据id,查询当前任务的情况
    // start();
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsStarting(false);
  //   }, 5000);
  // }, [isOpended]);
  // const doTaskSearch = (): void => {
  //   window.electron.ipcRenderer.send('task', TaskType.Search);
  // };
  const doTaskClose = (): void => {
    userActions.setIsOpended(false);
    window.electron.ipcRenderer.send("task", TaskType.Stop);
  };
  return (
    <>
      <Button
        block
        loading={isStarting && !isOpended}
        type="primary"
        disabled={isOpended || isStarting}
        onClick={doInit}
      >
        第一步,打开页面
      </Button>
      <Button block type="primary" disabled={!isOpended} onClick={doTask}>
        第二步,开始投递任务
      </Button>
      <Button block type="primary" disabled={!isOpended} onClick={doTaskClose}>
        结束任务
      </Button>
    </>
  );
}
