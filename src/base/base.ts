export const BaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://autojob.xiaomingmaoshe.com";
export const ApiUrl = BaseUrl + "/api";
