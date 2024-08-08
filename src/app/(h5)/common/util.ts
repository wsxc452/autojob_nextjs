import { message } from "antd";

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
