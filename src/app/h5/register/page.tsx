"use client";
import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils";
import message from "@/utils/antdMessage";
import CardWrap from "../common/CardWrap";
import { Button, Col, Form, Input, Row } from "antd";
import { useMemo, useState } from "react";

type FieldType = {
  email?: string;
  code?: string;
  remember?: string;
};
const fromInfo = {
  email: "doe+clerk_test@example.com",
  code: "424242",
};
const countMaxNum = 10;
export default function Page() {
  const [form] = Form.useForm(); // 创建表单实例
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [submiting, setIsSubmiting] = useState(false);
  const [isSendCode, setIsSendCode] = useState(false);
  const [countNum, setCountNum] = useState(countMaxNum);
  const router = useRouter();
  const codeMsgMemo = useMemo(() => {
    let codeMsg = "验证码";
    if (countNum !== countMaxNum) {
      codeMsg = `${countNum}s`;
    }

    return codeMsg;
  }, [countNum]); //

  function startCounter() {
    console.log("startCounter....------");
    const intervalId = setInterval(function () {
      console.log("startCounter....------1");
      setCountNum((prevCount: number) => {
        console.log("startCounter....------1-" + prevCount);
        if (prevCount <= 1) {
          clearInterval(intervalId); // 倒计时结束时清除计时器
          setVerifying(false);
          return countNum;
        }
        return prevCount - 1;
      });
    }, 1000);
  }

  // 处理注册表单的提交
  const handleSubmit = async () => {
    if (!isLoaded) return;
    if (!isSendCode) {
      message.info("请先获取验证码");
      return;
    }
    setIsSubmiting(true);
    const { code, email } = form.getFieldsValue(); // 获取
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code,
      });
      console.log("handleSubmit===completeSignUp", completeSignUp);
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
           or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/h5/index");
      }
    } catch (err) {
      console.error("Error:", err);
      const errmsg = getErrorMessage(err);
      if (errmsg.includes("is incorrect")) {
        message.info("验证码错误");
      } else {
        message.info(errmsg || "注册失败");
      }
      setIsSubmiting(false);
    }
  };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log("Failed:", errorInfo);
  // };
  const getVerificationCode = async () => {
    if (!isLoaded) {
      return;
    }
    const { email } = form.getFieldsValue(); // 获取
    console.log("getVerificationCode", email);
    if (email === "") {
      message.info("请输先入邮箱");
      return;
    }

    try {
      setVerifying(true);
      await signUp.create({
        emailAddress: email,
      });

      // Send the email with the verification code
      const codeRet = await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      console.log("codeRet", codeRet);
      startCounter();
      message.info("验证码已发送");
      setIsSendCode(true);
    } catch (err: any) {
      console.log("Error:", err);
      const errmsg = getErrorMessage(err);
      if (errmsg.includes("That email address is taken")) {
        message.info("邮箱已被注册");
      } else {
        message.info(errmsg || "验证码发送失败");
      }
      setCountNum(countMaxNum);
      setVerifying(false);
      setIsSendCode(false);
    }
  };

  // 显示注册表单以捕获用户名和密码
  return (
    <CardWrap>
      <Form
        name="basic"
        initialValues={{ ...fromInfo }}
        onFinish={handleSubmit}
        // onFinishFailed={onFinishFailed}
        // onValuesChange={onValuesChange}
        autoComplete="off"
        form={form}
      >
        <Row>
          <Col span={24}>
            <div className="my-2 text-center text-lg">注册 AutoJob</div>
          </Col>
        </Row>
        <Form.Item<FieldType>
          label="邮箱"
          name="email"
          rules={[{ required: true, message: "请输入邮箱" }]}
        >
          <Input type="email" size="large" allowClear />
        </Form.Item>
        <Form.Item
          label="验证码"
          name="code"
          rules={[{ required: true, message: "请输入验证码" }]}
        >
          <Row gutter={10}>
            <Col span={14}>
              <Form.Item name="code" noStyle>
                <Input size="large" allowClear />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Button
                type="primary"
                size="large"
                loading={verifying}
                block
                onClick={getVerificationCode}
              >
                {codeMsgMemo}
              </Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item>
          <Button
            size="large"
            loading={submiting}
            disabled={submiting}
            type="primary"
            htmlType="submit"
            block
          >
            注册
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            type="default"
            onClick={() => router.push("/h5/login")}
            block
          >
            去登录
          </Button>
        </Form.Item>
      </Form>
    </CardWrap>
  );
}
