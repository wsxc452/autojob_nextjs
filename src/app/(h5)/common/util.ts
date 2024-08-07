export function test() {
  console.log("test");
}
export function doIpc(type: string, params: any) {
  console.log("doIpc");
  if (window.electron?.ipcRenderer) {
    window.electron.ipcRenderer.send(type, params);
  } else {
    throw new Error("请在electron环境下运行");
  }
}
