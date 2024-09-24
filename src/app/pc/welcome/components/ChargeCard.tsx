"use client";
import { useSnapshot } from "valtio";
import { Button, Form, Input } from "antd";
import { redeemedCode } from "@/service/users";
import message from "@/utils/antdMessage";
import { doIpc, getChinaTime } from "../../common/util";
import { TaskType } from "../../common/types";
import DebounceWrap from "../../components/common/DebounceWrap";
import pcStore, { userActions } from "../../pcStates/pcStore";
import { use, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ChromeConfig from "./ChromeConfig";
import ReferrerForm from "./ReferrerForm";

// 加载插件
dayjs.extend(utc);
dayjs.extend(timezone);

function getTimeDesc(userInfo: any) {
  const startTime = userInfo.cardStartTime
    ? getChinaTime(userInfo.cardStartTime)
    : "";
  const endTime = userInfo.cardEndTime
    ? getChinaTime(userInfo.cardEndTime)
    : "";
  if (!startTime || !endTime) {
    return "尚未充值";
  }
  return ` ${startTime} - ${endTime}`;
}
function ChargeCard() {
  const storeInfo = useSnapshot(pcStore);
  const userInfo = storeInfo.userInfo;
  const [form] = Form.useForm();
  const test = async () => {
    const ret = await doIpc("task", { type: TaskType.Test });
    console.log("ret", ret);
  };
  const stop = async () => {
    console.log("stop");
    const ret = await doIpc("task", { type: TaskType.Paused });
    console.log("ret", ret);
  };

  const checkFn = async () => {
    try {
      // const checkRet = await checkAndSubscibeUserAccount(userInfo.userId);
      // console.log("User account is ok", checkRet);
      // message.info("用户账户正常" + checkRet.checkInfo.msg);
      return true;
    } catch (e: any) {
      console.error(e);
      message.error(e.toString());
    }
  };

  const userTimeDesc = useMemo(() => {
    return getTimeDesc(userInfo);
  }, [userInfo]);

  useEffect(() => {
    userActions.syncUserInfo(userInfo.userId);
  }, [userInfo.userId]);
  return (
    <div className="flex flex-col p-5">
      <div>
        <h1 className="text-center text-2xl font-bold">欢迎使用AutoJob</h1>
        <h3 className="my-5 text-center text-xl font-bold">
          有效期: <span className="text-blue-500">{userTimeDesc}</span>
        </h3>
        <h3 className="my-5 text-center text-xl font-bold">
          剩余投递点数 <span className="text-blue-500">{userInfo.points}</span>
        </h3>

        {/* <div className="my-5 flex flex-col gap-3">
          <div>公告1: 每自动发送一次招呼语,扣除1个投递点数 </div>
          <div>公告2: 关注群主后,屏截图找群主要1000积分</div>
        </div> */}
        <h1 className="font-mix-blend-color-dodge mb-5 text-2xl">操作步骤:</h1>
        <pre>
          1. 在浏览器配置本地的Chrome路径; <br />
          2. 在后台配置好任务; <br />
          3. 在后台配置好打招呼语句; <br />
        </pre>
      </div>
    </div>
  );
}

export default ChargeCard;
