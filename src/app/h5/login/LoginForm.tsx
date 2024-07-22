import React from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

export default function Page({ onSumbit }: { onSumbit: Function }) {
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", JSON.stringify(values));
    localStorage.setItem("userInfo", JSON.stringify(values));
    onSumbit(values);
  };
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="用户名"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item<FieldType>
        label="密码"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
      <div className="flex w-full flex-col items-center">
        <Form.Item<FieldType>
          className=" self-start "
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 2, span: 16 }}
        >
          <Checkbox>记住我</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
          <Button type="primary" htmlType="submit" className="w-70">
            Submit
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
}
