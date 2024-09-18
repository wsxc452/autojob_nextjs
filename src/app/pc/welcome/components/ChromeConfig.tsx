"use client";
import { Button, Form, Input, Select, SelectProps } from "antd";
import pcStore, { userActions } from "@/app/pc/pcStates/pcStore";
import { useSnapshot } from "valtio";
import { useEffect, useMemo, useState } from "react";
import message from "@/utils/antdMessage";
import { ApiUrl } from "@/base/base";
function SettingPage() {
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
    const retInfo = await fetch(`${ApiUrl}/users/config`, {
      cache: "no-cache",
      method: "POST",
      body: JSON.stringify({
        chromePath: values.chromePath,
      }),
    });
    const ret = await retInfo.json();
    console.log("ret", ret);
    userActions.syncUserInfo();
    message.success("保存成功");
  };

  console.log("platform", userInfo);

  return (
    <div className="mt-10 flex h-full w-full flex-col items-center justify-start">
      <Form form={form} onFinish={onsubmit} className="w-full">
        <Form.Item
          label="chrome路径"
          name="chromePath"
          rules={[{ required: true }]}
        >
          <Input allowClear style={{ fontSize: "12px" }} />
        </Form.Item>
        {/* <Form.Item
            label="当前平台"
            name="platform"
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: 120, fontSize: "12px" }}
              // onChange={handleChange}
              options={salayOptions}
            />
          </Form.Item> */}
        <Button block htmlType="submit" type="primary">
          保存配置
        </Button>
      </Form>
      <div className="mt-5 flex w-full flex-col gap-2  text-sm">
        <div className="text-sm font-bold">
          温馨提示: <br />
          (请根据填写Chrome浏览器的真实路径,路径中如有空格不要删掉)
        </div>
        <div>默认Windows平台chrome路径:</div>
        <div>{DetaultWindowsPath}</div>
        <div>默认MacOS平台chrome路径:</div>
        <div>{DefaultMacPath}</div>
      </div>
    </div>
  );
}

export default SettingPage;
