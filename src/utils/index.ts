export function getErrorMessage(err: any, defaultMsg: string = "未知错误") {
  if (err.clerkError) {
    return err.errors[0].message;
  }
  return "An error occurred";
}
