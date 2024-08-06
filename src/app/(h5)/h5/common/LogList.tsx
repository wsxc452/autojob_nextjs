import { useEffect, useRef } from 'react';
import { Button } from 'antd';
import { useSnapshot } from 'valtio';
// import { LogBody } from '../../common/types';
import store, { userActions } from '@/states/globaStore';

export default function LogList() {
  // const [logs, setLogs] = useState<LogBody[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const { logs } = useSnapshot(store);
  const clearLogs = () => {
    userActions.clearLog();
  };
  useEffect(() => {
    const mockLogs = Array.from({ length: 600 }, (_, index) => ({  
      id: index,
      time: new Date().toLocaleString(),
      type: 'info',
      message: `message${index}`,
    }));  
    userActions.setLogs(mockLogs);
  },[]);
  // 订阅日志
  // useEffect(() => {
  //   window.electron.ipcRenderer.on('taskLog', (_event, info: LogBody) => {
  //     const time = new Date().getTime();
  //     console.log('taskLog addEvent....', time, info.message);
  //     setLogs((prevLogs) => [
  //       ...prevLogs,
  //       {
  //         id: prevLogs.length,
  //         time: info.time,
  //         type: info.type,
  //         message: info.message,
  //       },
  //     ]);
  //   });
  //   return () => {
  //     window.electron.ipcRenderer.removeAllListeners('taskLog');
  //   };
  // }, []);

  useEffect(() => {
    console.log('logs===========', logs);
    console.log('listRef', listRef.current);
    if (listRef.current) {
      console.log('logs', logs.length, listRef.current.scrollHeight);
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [logs]); // 当 items 更新时触发滚动

  return (
    <div className="w-full  flex flex-col h-full  relative">
      <div className="text-sm mb-2">
        消息数量: {logs.length}
        <Button
          className="float-right"
          size="small"
          type="default"
          onClick={() => clearLogs()}
        >
          清除消息
        </Button>
      </div>
      <div
        ref={listRef}
        className="flex-1  p-2 rounded-lg  text-black text-sm"
        style={{   overflowX: 'hidden', overflowY: 'scroll' }}
        id="scrollableList"
      >
        {logs.map((log) => (
          <div
            className="flex flex-row flex-wrap items-start justify-start border-b-slate-200 border-b-2"
            key={log.id}
          >
            [{log.time}]- {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}
