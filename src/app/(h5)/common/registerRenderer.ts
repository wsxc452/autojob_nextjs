/* eslint-disable dot-notation */
import { LogBody, StoreActionBody } from '../common/types';
import { userActions } from '@/states/globaStore';

export default function registerEvents() {
  if(window.electron) {
    window.electron.ipcRenderer.on('taskLog', (_event, info: LogBody) => {
      const time = new Date().getTime();
      console.log('taskLog addEvent....', time, info.message);
      userActions.addLog(info);
      // setLogs((prevLogs) => [
      //   ...prevLogs,
      //   {
      //     id: prevLogs.length,
      //     time: info.time,
      //     type: info.type,
      //     message: info.message,
      //   },
      // ]);
    });
  }

}
