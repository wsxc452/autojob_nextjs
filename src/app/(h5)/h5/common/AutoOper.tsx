import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { Button } from 'antd';
import { TaskType } from '../../common/types';
import store,{userActions} from "@/states/globaStore";

export default function AutoOper() {
  const { isOpended } = useSnapshot(store);
  // const [isOpened, setIsOpened] = useState(globalStore.isOpened);
  const [isStarting, setIsStarting] = useState(false);
  const doInit = (): void => {
    userActions.setIsOpended(true);
    userActions.clearLog();
    setIsStarting(true);
    window.electron.ipcRenderer.send('task', TaskType.Init);
  };
  const doTask = (): void => {
    window.electron.ipcRenderer.send('task', TaskType.Start);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsStarting(false);
    }, 5000);
  }, [isOpended]);
  // const doTaskSearch = (): void => {
  //   window.electron.ipcRenderer.send('task', TaskType.Search);
  // };
  const doTaskClose = (): void => {
    userActions.setIsOpended(false);
    window.electron.ipcRenderer.send('task', TaskType.Stop);
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
        第二步,开始任务
      </Button>
      <Button block type="primary" disabled={!isOpended} onClick={doTaskClose}>
        结束任务
      </Button>
    </>
  );
}
