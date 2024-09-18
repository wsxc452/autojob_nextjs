"use client";
import { Button, Form, Input, Select, SelectProps } from "antd";
import pcStore, { userActions } from "@/app/pc/pcStates/pcStore";
import { useSnapshot } from "valtio";
import { useEffect, useMemo, useState } from "react";
import message from "@/utils/antdMessage";
import { ApiUrl } from "@/base/base";
function ReferrerForm() {
  const { userInfo } = useSnapshot(pcStore);
  const DetaultWindowsPath =
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const DefaultMacPath =
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const [form] = Form.useForm();
  //   const [formValue, setFormValue] = useState(initValues);

  const chromePath = useMemo(() => {
    const chromeInfo = JSON.parse(userInfo.configJson || "{}");
    console.log("chromeInfo====", chromeInfo);
    return chromeInfo.chromePath || "";
  }, [userInfo.configJson]);

  useEffect(() => {
    form.setFieldsValue({
      chromePath: chromePath,
    });
  }, [form, chromePath]);

  const onsubmit = async (values: any) => {
    console.log("values", values);
    const retInfo = await fetch(`${ApiUrl}/users/referrerCode`, {
      cache: "no-cache",
      method: "POST",
      body: JSON.stringify({
        code: values.code,
      }),
    });
    const ret = await retInfo.json();
    console.log("ret", ret);
    if (ret.status === 200) {
      userActions.syncUserInfo();
      message.success("绑定成功");
    } else {
      message.error(ret.data.error || "绑定失败 !");
    }
  };

  console.log("platform", userInfo);

  return (
    <div className="my-5 flex h-full w-full flex-col items-center justify-start">
      <div className={`mb-5 w-full`}>
        <Form
          form={form}
          onFinish={onsubmit}
          className="flex w-full flex-col  "
        >
          <Form.Item label="推荐人" name="code" rules={[{ required: true }]}>
            <Input allowClear style={{ fontSize: "12px" }} />
          </Form.Item>
          <Button block htmlType="submit" type="primary">
            绑定推荐人，领取积分
          </Button>
        </Form>
      </div>
      <div className="flex w-full flex-col gap-2  text-sm">
        <div className="text-sm font-bold">
          温馨提示: <br />
        </div>
        <p>绑定推荐人后,您将获取积分奖励</p>
      </div>
    </div>
  );
}

export default ReferrerForm;
