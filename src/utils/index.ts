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
