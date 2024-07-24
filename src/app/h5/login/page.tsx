"use client";
import { getErrorMessage } from "@/utils";
import Cookies from "js-cookie";

import { useClerk, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EmailCodeFactor } from "@clerk/types";
import message from "@/utils/antdMessage";
import type { FormProps } from "antd";
import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Spin,
} from "antd";
import CardWrap from "../common/CardWrap";
const countMaxNum = 10;
type FieldType = {
  email?: string;
  code?: string;
  remember?: string;
};
const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function deleteCookie(name: string) {
  console.log(" deleteCookie", name);
  document.cookie = name + "=;Max-Age=0;path=/"; // path 需要与设置时一致
}

function deleteAllCookies() {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    // deleteCookie(name);
    console.log("delcooke", name);
    Cookies.remove(name);
  }
}

const fromInfo = {
  email: "wsxc452@gmail.com",
  code: "424242",
  remember: true,
};

export default function Page() {
  const { signOut } = useClerk();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [form] = Form.useForm(); // 创建表单实例
  const router = useRouter();

  const [verifying, setVerifying] = useState(false);
  const [submiting, setIsSubmiting] = useState(false);
  const [countNum, setCountNum] = useState(countMaxNum);
  const [isSendCode, setIsSendCode] = useState(false);

  const logout = async function () {
    console.log("logout");
    try {
      const ret = await signOut({
        redirectUrl: "/h5/login",
      });
      deleteAllCookies();
      console.log("ret", JSON.stringify(ret));
      // router.replace("/h5/login");
    } catch (e) {
      console.log("logout error", e);
      message.info("logout error");
    }
  };

  const codeMsgMemo = useMemo(() => {
    let codeMsg = "验证码";
    if (countNum !== countMaxNum) {
      codeMsg = `${countNum}s`;
    }

    return codeMsg;
  }, [countNum]); //

  console.log("=============isLoaded", isLoaded, signIn);
  // useEffect(() => {
  //   console.log(document.cookie);
  //   console.log("isLoaded:", isLoaded);
  //   console.log("signIn:", signIn);
  //   if (!isLoaded) {
  //   }
  //   // if (isLoaded && signIn) {
  //   //   // 逻辑...
  //   //   console.log("isLoaded-----------signIned");
  //   // }else if(){

  //   // }
  // }, [isLoaded, router]);

  // function startCounter() {
  //   console.log("startCounter....------");
  //   const intervalId = setInterval(function () {
  //     console.log("startCounter....------1");
  //     setCountNum((prevCount: number) => {
  //       console.log("startCounter....------1-" + prevCount);
  //       if (prevCount <= 1) {
  //         clearInterval(intervalId); // 倒计时结束时清除计时器
  //         setVerifying(false);
  //         return countNum;
  //       }
  //       return prevCount - 1;
  //     });
  //   }, 1000);
  // }

  async function getVerificationCode() {
    console.log("getVerificationCode");
    if (!isLoaded) {
      console.log("getVerificationCode isLoaded", isLoaded);
      return;
    }
    console.log("getVerificationCode222");
    const { email } = form.getFieldsValue(); // 获取
    console.log("getVerificationCode", email);
    if (email === "") {
      message.info("请输先入邮箱");
      return;
    }
    try {
      setVerifying(true);
      console.log("getVerificationCode12223333", signIn, email);
      if (signIn) {
        const signInResp = await signIn.create({
          identifier: email,
          strategy: "email_code",
        });
        console.log("signInResp", signInResp);
        // const { emailAddressId } = signInResp.supportedFirstFactors.find(
        //   (ff) => ff.strategy === "email_code" && ff.safeIdentifier === email,
        // )! as EmailCodeFactor;
        // // emailAddressIdRemote = signInRespRet?.emailAddressId;
        // console.log("emailRet", JSON.stringify(emailAddressId));

        // await signIn.prepareFirstFactor({
        //   strategy: "email_code",
        //   emailAddressId: emailAddressId,
        // });
        // console.log("startCounter....1");
        // // startCounter();
        console.log("startCounter....2");
        message.info("验证码已发送");
        setIsSendCode(true);
      }
    } catch (err: any) {
      const errmsg = getErrorMessage(err);
      console.error("Error:", errmsg);
      if (errmsg.includes("Couldn't find your account")) {
        message.info("邮箱未注册");
      } else {
        message.info(errmsg || "验证码发送失败");
      }
      setCountNum(countMaxNum);
      setVerifying(false);
      setIsSendCode(false);
    }
  }
  const handleSubmit = async () => {
    console.log("handleSubmit", isLoaded, signIn);
    if (!isLoaded || !signIn) {
      return;
    }
    console.log("handleSubmit", form.getFieldsValue());
    if (!isSendCode) {
      message.info("请先获取验证码");
      return;
    }

    const { code, email } = form.getFieldsValue(); // 获取

    console.log("handleSubmit", { code, email });

    setIsSubmiting(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: code,
      });
      console.log("values", JSON.stringify(result));
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/h5/index");
      } else {
        console.log(result);
        message.info("登录失败");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      const errmsg = getErrorMessage(err);
      if (errmsg.includes("Invalid action" || errmsg.includes("is missing"))) {
        message.info("请先获取验证码");
      } else if (errmsg.includes("is incorrect")) {
        message.info("验证码错误");
      } else {
        message.info(errmsg || "登录失败");
      }
      setIsSubmiting(false);
    } finally {
    }
  };
  return (
    <CardWrap>
      <Spin tip="Loading..." spinning={!isLoaded}>
        <Form
          name="basic"
          initialValues={{ ...fromInfo }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          // onValuesChange={onValuesChange}
          autoComplete="off"
          form={form}
        >
          <Row>
            <Col span={24}>
              <div className="my-2 text-center text-lg">登录 AutoJob</div>
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
                  htmlType="button"
                  loading={verifying}
                  block
                  onClick={getVerificationCode}
                >
                  {codeMsgMemo}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 0, span: 16 }}
          >
            <Checkbox>记住账号</Checkbox>
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
              登陆
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              type="default"
              onClick={() => router.push("/h5/register")}
              block
            >
              注册
            </Button>
          </Form.Item>
          <Form.Item>
            <Button size="large" type="default" onClick={logout} block>
              清除用户数据
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </CardWrap>
  );
}
