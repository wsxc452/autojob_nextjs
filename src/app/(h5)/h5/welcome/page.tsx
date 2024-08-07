"use client";
import store, { userActions } from "@/app/h5/h5/store/index";
import { useSnapshot } from "valtio";
import { Button, Form, Input } from "antd";
import { redeemedCode } from "@/service/users";
import message from "@/utils/antdMessage";
import { useState } from "react";
import DebounceWrap from "../common/DebounceWrap";

function WelcomePage() {
  const { userInfo } = useSnapshot(store);
  const [form] = Form.useForm();
  const onSumbit = async function (values: any) {
    console.log("onSumbit", values);
    try {
      const ret = await redeemedCode(values.code);
      if (ret.status === 200 && ret.data) {
        message.success(`成功充值${ret.data.data}点`);
        userActions.syncUserInfo(userInfo.userId);
        form.resetFields();
      } else {
        message.error(ret.data.error || "充值失败");
      }
      console.log("ret", ret);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="flex flex-col p-5">
      <div>
        <h1 className="text-center text-2xl font-bold">欢迎使用AutoJob</h1>
        <h3 className="my-5 text-center text-xl font-bold">
          剩余投递点数 <span className="text-blue-500">{userInfo.points}</span>
        </h3>
        <div>
          <Form
            onFinish={onSumbit}
            initialValues={{
              code: "",
            }}
            form={form}
          >
            <Form.Item
              label="卡密"
              name="code"
              rules={[{ required: true, message: "请输入卡密,充值精力点数" }]}
            >
              <Input allowClear maxLength={8} />
            </Form.Item>
            <Form.Item>
              <DebounceWrap debounceTime={1000}>
                <Button block type="primary" htmlType="submit">
                  充值
                </Button>
              </DebounceWrap>
            </Form.Item>
          </Form>
        </div>
        <div className="my-5 flex flex-col gap-3">
          <div>公告1: 每自动发送一次招呼语,扣除1个投递点数 </div>
          <div>公告2: 关注群主后,屏截图找群主要1000投递点券</div>
        </div>
        <h1 className="font-mix-blend-color-dodge mb-5 text-2xl">操作步骤:</h1>
        <pre>
          1. 在配置页面本地的Chrome路径; <br />
          2. 在后台配置好任务; <br />
          3. 在后台配置好打招呼语句; <br />
        </pre>
      </div>
    </div>
  );
}

export default WelcomePage;
