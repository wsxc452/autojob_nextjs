// import pinyin from "pinyin";
import message from "./antdMessage";

export function getErrorMessage(err: any, defaultMsg: string = "未知错误") {
  if (err.clerkError) {
    return err.errors[0].message;
  }
  return "An error occurred";
}

export function arCall(key: string, data: Record<string, any> = {}) {
  console.log("arCall", key, JSON.stringify(data));
  // @ts-ignore
  if (!window.airscript) {
    message.info("请在airscript中使用");
    return;
  }
  // @ts-ignore
  window.airscript.call(key, JSON.stringify(data));
}

// 定义一个函数获取城市的首字母
// export const getCityInitial = (cityName: string) => {
//   // 使用 pinyin 库获取拼音
//   const pinyinArray = pinyin(cityName, {
//     style: pinyin.STYLE_FIRST_LETTER, // 只获取首字母
//     heteronym: false, // 是否启用多音字
//   });
//   console.log(pinyinArray); // 输出：[ [ 'b' ], [ 'j' ], [ 's' ] ]
//   // 提取首字母并连接成字符串
//   return pinyinArray.map((item) => item[0]).join("");
// };
