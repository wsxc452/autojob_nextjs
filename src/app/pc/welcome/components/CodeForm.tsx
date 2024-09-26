"use client";
import { useSnapshot } from "valtio";
import { Button, Form, Input } from "antd";
import { redeemedCode, wordCode } from "@/service/users";
import message from "@/utils/antdMessage";
import { doIpc, getChinaTime } from "../../common/util";
import { TaskType } from "../../common/types";
import DebounceWrap from "../../components/common/DebounceWrap";
import pcStore, { userActions } from "../../pcStates/pcStore";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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

const options = [
  {
    value: "code",
    label: "卡密",
  },
  {
    value: "word",
    label: "口令",
  },
];

function CodeForm() {
  const storeInfo = useSnapshot(pcStore);
  const userInfo = storeInfo.userInfo;
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [chargeType, setChargeType] = useState("code");
  const test = async () => {
    const ret = await doIpc("task", { type: TaskType.Test });
    console.log("ret", ret);
  };
  const stop = async () => {
    console.log("stop");
    const ret = await doIpc("task", { type: TaskType.Paused });
    console.log("ret", ret);
  };
  const onSumbit = async function (values: any) {
    try {
      setSubmitLoading(true);
      const isC8 = values.code.toUpperCase().startsWith("C8");
      if (isC8) {
        const ret = await redeemedCode(values.code, userInfo.userId);
        if (ret.status === 200 && ret.data) {
          message.success(`成功领取核销卡券`);
          // console.log("userInfo===>", userInfo);
          userActions.syncUserInfo(userInfo.userId);
          form.resetFields();
        } else {
          message.error(ret.data.error || "充值失败 !");
        }
        console.log("ret", ret);
      } else {
        const ret = await wordCode(values.code, userInfo.userId);
        if (ret.status === 200 && ret.data) {
          message.success(`成功领取口令卡券`);
          // console.log("userInfo===>", userInfo);
          userActions.syncUserInfo(userInfo.userId);
          form.resetFields();
        } else {
          message.error(ret.data.error || "充值失败 !");
        }
        console.log("ret", ret);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitLoading(false);
    }
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
        {/* {!userInfo.isBind && <ReferrerForm />} */}
        <div>
          <Form
            onFinish={onSumbit}
            initialValues={{
              code: "",
            }}
            form={form}
          >
            <Form.Item
              label="充值"
              name="code"
              rules={[{ required: true, message: "请输入卡密,充值精力点数" }]}
            >
              <Input
                allowClear
                minLength={4}
                placeholder="请输入卡密或者口令,卡密C8开头"
                maxLength={20}
              />
              {/* <Space.Compact className="w-full">
                <Select
                  defaultValue={chargeType}
                  onChange={(value) => {
                    setChargeType(value);
                  }}
                  options={options}
                  style={{ width: 120 }}
                />
                <Input allowClear minLength={4} maxLength={20} />
              </Space.Compact> */}
            </Form.Item>
            <Form.Item>
              <DebounceWrap debounceTime={1000}>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                >
                  核销
                </Button>
              </DebounceWrap>
            </Form.Item>
          </Form>
        </div>
        <div className="pb-5 text-lg text-red">
          提示: 卡密购买后请在此核销. 以下两种方式均可购买！
          <div className="mt-5">
            <span>卡密购买</span>
            <div>
              <a href="https://www.shiyuei.cn/links/54C3BBD6" target="_blank">
                卡密购买链接
              </a>
            </div>
          </div>
          <div className="mt-5">
            <span>支付宝扫一扫购买</span>
            <Image
              src={"/images/logo/generateqrcode.png"}
              width={80}
              height={80}
              alt="Brand"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeForm;
