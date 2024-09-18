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

// console.log(mixMiddleStr('wsxc452xxxx.coww', 3));  // 输出 'wsxc452***x.coww'
// console.log(mixMiddleStr('wsxc452xxxx.coww', 30)); // 输出 '********************'
function mixMiddleStr(str: string, repalceNum: number) {
  const len = str.length;
  if (repalceNum >= len) {
    // 如果num大于等于字符串长度，则返回全是 '*' 的字符串
    return "*".repeat(len);
  }

  const middleStart = Math.floor((len - repalceNum) / 2); // 中间部分的起点
  const middleEnd = middleStart + repalceNum; // 中间部分的终点

  // 构造新的字符串
  return (
    str.slice(0, middleStart) + "*".repeat(repalceNum) + str.slice(middleEnd)
  );
}

/**
 * 加密数组字符串
 * @param data
 * @param fieldsToSanitize
 * @returns []
 */
export function sanitizeData(
  data: [] | Record<string, any>,
  fieldsToSanitize: string[],
): Record<string, any> {
  if (!Array.isArray(data)) {
    data = [data];
  }
  return data.map((item: any) => {
    const sanitizedItem = { ...item };
    fieldsToSanitize.forEach((field) => {
      if (sanitizedItem[field]) {
        // 例如：张三丰 -> 张**丰
        sanitizedItem[field] = mixMiddleStr(sanitizedItem[field], 4);
      }
    });
    return sanitizedItem;
  });
}
