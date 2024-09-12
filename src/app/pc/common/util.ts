import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
export function test() {
  console.log("test");
}
export async function doIpc(
  taskKey: string,
  params: any,
): Promise<{
  status: boolean;
  message: string;
}> {
  console.log("doIpc", window.electron, taskKey, params);
  if (window.electron?.ipcRenderer) {
    const ret = await window.electron.ipcRenderer.invoke(taskKey, params);
    return ret;
  } else {
    return {
      status: false,
      message: "请在electron环境下运行!",
    };
  }
}
export const ChinaZone = "Asia/Shanghai";
export function getChinaTime(time: Date, format = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(time).tz(ChinaZone).format(format);
}
