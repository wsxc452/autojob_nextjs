"use client";
import { Button, Form, Input, Select, SelectProps } from "antd";
import store, { userActions } from "@/app/h5/h5/store";
import { useSnapshot } from "valtio";
import { useEffect, useState } from "react";
function SettingPage() {
  const { chromeInfo } = useSnapshot(store);
  const DetaultWindowsPath =
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
  const DefaultMacPath =
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const initValues = {
    platform: "",
    chromePath: "",
  };
  const [form] = Form.useForm();
  //   const [formValue, setFormValue] = useState(initValues);
  const onsubmit = (values: any) => {
    console.log("values", values);
    userActions.setChromeIno({
      path: values.chromePath,
      platform: values.platform,
    });
  };

  console.log("platform", chromeInfo);

  useEffect(() => {
    // console.log("chromeInfo", chromeInfo);
    const localStoreChromeInfo = localStorage.getItem("chromeInfo");
    if (localStoreChromeInfo) {
      const chromeInfo = JSON.parse(localStoreChromeInfo);
      console.log("localStoreChromeInfo", chromeInfo);
      userActions.setChromeIno(chromeInfo);
      //   setFormValue({
      //     platform: chromeInfo.platform,
      //     chromePath: chromeInfo.path,
      //   });
      form.setFieldsValue({
        platform: chromeInfo.platform,
        chromePath: chromeInfo.path,
      });
    }
  }, []);

  const salayOptions: SelectProps["options"] = [
    {
      label: "Windows",
      value: "Windows",
    },
    {
      label: "macOS",
      value: "macOS",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];
  return (
    <div className="mt-10 flex h-full w-full flex-col items-center justify-start">
      <div className="box-border w-[90%] rounded-lg bg-white bg-opacity-50 p-5 shadow-5">
        <Form form={form} onFinish={onsubmit}>
          <Form.Item
            label="chrome路径"
            name="chromePath"
            rules={[{ required: true }]}
          >
            <Input allowClear style={{ fontSize: "12px" }} />
          </Form.Item>
          <Form.Item
            label="当前平台"
            name="platform"
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: 120, fontSize: "12px" }}
              // onChange={handleChange}
              options={salayOptions}
            />
          </Form.Item>
          <Button block htmlType="submit" type="primary">
            保存配置
          </Button>
        </Form>
      </div>
      <div className="mt-10 flex flex-col gap-2 px-5 py-2 text-sm">
        <div className="text-sm font-bold">
          温馨提示: <br />{" "}
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
