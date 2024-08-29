export const BaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://autojob.xiaomingmaoshe.com";
export const ApiUrl = BaseUrl + "/api";
