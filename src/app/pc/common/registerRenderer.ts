/* eslint-disable dot-notation */
import { LogBody } from "../common/types";
import pcStore, { userActions } from "@/app/pc/pcStates/pcStore";

export default function registerEvents() {
  if (window.electron) {
    // @ts-ignore

    // return new Promise((resolve) =>
    //   setTimeout(() => {
    //     resolve({
    //       status: true,
    //       msg: {
    //         id: 1,
    //         name: "11",
    //         params: params || {},
    //       },
    //     });
    //   }, 3000),
    // );
    window.electron.ipcRenderer.on("taskEnd", (_event, info: LogBody) => {
      console.log("taskEnd addEvent.. ..", info);
      userActions.setIsTaskEnd(true);
    });

    window.electron.ipcRenderer.on("taskLog", (_event, info: LogBody) => {
      const time = new Date().getTime();
      console.log("taskLog addEvent.. ..", time, info.message);
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
    // window.electron.ipcRenderer.on(
    //   "postUrl",
    //   async (
    //     _event,
    //     params: {
    //       url: string;
    //       body: Record<string, any>;
    //     },
    //   ) => {
    //     const time = new Date().getTime();
    //     const retInfo = {
    //       status: false,
    //       message: "",
    //       data: {},
    //     };
    //     const response = await fetch(params.url, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(params.body || {}),
    //     });
    //     if (!response.ok) {
    //       retInfo.message = "Network response was not ok";
    //       // throw new Error("Network response was not ok");
    //     }
    //     retInfo.status = true;
    //     retInfo.data = response.json();

    //   },
    // );
  }
  // @ts-ignore
  window.postUrl = async function (url: string, params: any, header: any = {}) {
    console.log("postUrl", url, params, header);
    try {
      if (header && typeof header["Zp_token"] !== "undefined") {
        // @ts-ignore
        // params["Zp_token"] = header["Zp_token"];
      }
      const headerComine = {
        ...header,
        "Content-Type": "application/json",
      };
      console.log("headerComine", headerComine);
      const ret = await fetch(url, {
        cache: "no-cache",
        method: "POST",
        headers: headerComine,
        body: JSON.stringify(params || {}),
      });

      console.log("postUrl===>", ret);
      if (ret.status !== 200) {
        return { status: ret.ok, message: ret.statusText };
      }
      try {
        const retInfo = await ret.json();
        console.log("postUrl", retInfo);
        return {
          status: ret.ok,
          data: retInfo,
        };
      } catch (e) {
        console.log({
          headers: headerComine,
          body: JSON.stringify(params || {}),
        });
        console.error(ret);
        console.log("postUrl error", e);
        return {
          status: ret.ok,
          data: {},
        };
      }
    } catch (e: any) {
      console.log("postUrl error", e);
      return { status: false, message: e.toString() };
    }
  };

  // @ts-ignore
  window.getUrl = async function (url: string) {
    console.log("getUrl", url);
    try {
      const ret = await fetch(url, {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("getUrl===>", ret);
      if (ret.status !== 200) {
        return { status: ret.ok, message: ret.statusText };
      }
      const retInfo = await ret.json();
      // console.log("getUrl", retInfo);
      if (retInfo.code && retInfo.code !== 0) {
        return {
          status: false,
          message: retInfo.message || url + "异常",
        };
      }
      return {
        status: ret.ok,
        data: retInfo,
      };
    } catch (e: any) {
      console.log("getUrl error", e);
      return { status: false, message: e.toString() };
    }
  };

  // @ts-ignore
  window.freshAccount = async function (paramsStr: string) {
    const params = JSON.parse(paramsStr) as { points: number };
    console.log("freshAccount", params);
    userActions.setUserInfo(Object.assign({}, pcStore.userInfo, params));
    return { status: true, message: "账户刷新成功" };
  };

  // @ts-ignore
  window.getInitData = async function (key: string) {
    // @ts-ignore
    // return h5Store[key];

    return {
      userInfo: {},
      taskInfo: {},
      chromeInfo: {},
    };
  };
}
