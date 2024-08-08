"use client";
import { arCall, getErrorMessage } from "@/utils";
import message from "@/utils/antdMessage";
import { useClerk, useSignIn } from "@clerk/nextjs";
import { Button, Checkbox, Col, Form, FormProps, Input, Row } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useCountdown from "../common/useCountdown";
const fromInfo = {
  email: "doe+clerk_test@example.com",
  code: "424242",
  remember: true,
};
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
const countMaxNum = 3;
export default function LoginForm({
  globaStore,
}: Readonly<{ globaStore: any }>) {
  const { signOut } = useClerk();
  const { signIn, isLoaded, setActive } = useSignIn();
  const { count, start, pause, reset, go, isActive } = useCountdown(
    countMaxNum,
    () => {
      setVerifying(false);
    },
  );

  const [form] = Form.useForm(); // 创建表单实例
  const router = useRouter();

  const [verifying, setVerifying] = useState(false);
  const [submiting, setIsSubmiting] = useState(false);
  const [isSendCode, setIsSendCode] = useState(false);

  const closeApp = function () {
    console.log("closeApp");
    arCall("closeApp");
    // try {
    //   const ret = await signOut({
    //     redirectUrl: "/h5/login",
    //   });
    //   console.log("ret", JSON.stringify(ret));
    //   // router.replace("/h5/login");
    // } catch (e) {
    //   console.log("logout error", e);
    //   message.info("logout error");
    // }
  };

  const codeMsgMemo = useMemo(() => {
    let codeMsg = "验证码";
    if (isActive) {
      codeMsg = `${count}s`;
    }

    return codeMsg;
  }, [isActive, count]); //

  if (!isLoaded || !signIn) {
    return <h1 className="text-center">loading...</h1>;
  }
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

  function startCounter() {
    if (isActive) {
      return;
    }
    start();
  }

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
        startCounter();
        console.log("startCounter....2");
        message.info("验证码已发送");
        setIsSendCode(true);
      }
    } catch (err: any) {
      const errmsg = getErrorMessage(err);
      console.error("Error:", errmsg);
      console.dir(errmsg);
      if (errmsg.includes("Couldn't find your account")) {
        message.info("邮箱未注册");
      } else if (errmsg.includes("Session already exists")) {
        message.info("用户已经登陆");
      } else {
        message.info(errmsg || "验证码发送失败");
      }
      setVerifying(false);
      setIsSendCode(false);
      reset();
    }
  }

  const handleSumitCb = async function () {
    console.log("handleSubmit", isLoaded, signIn);
    if (!isLoaded || !signIn) {
      return <h1>loading...</h1>;
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
        router.push("/h5/welcome");
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
    <div>
      <Form
        name="basic"
        size="small"
        initialValues={{ ...fromInfo }}
        onFinish={handleSumitCb}
        onFinishFailed={onFinishFailed}
        // onValuesChange={onValuesChange}
        autoComplete="off"
        form={form}
      >
        {/* <Row>
          <Col span={24}>
            <div className="my-2 text-center text-lg">登录 AutoJob</div>
          </Col>
        </Row> */}
        <Form.Item<FieldType>
          style={{ marginBottom: "12px" }}
          label="邮箱"
          name="email"
          rules={[{ required: true, message: "请输入邮箱" }]}
        >
          <Input type="email" size="large" allowClear />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: "12px" }}
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
                loading={isActive}
                disabled={isActive || verifying}
                block
                onClick={getVerificationCode}
              >
                {codeMsgMemo}
              </Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item<FieldType>
          style={{ marginBottom: "12px" }}
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 0, span: 16 }}
        >
          <Checkbox>记住账号</Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: "12px" }}>
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
        <Form.Item style={{ marginBottom: "12px" }}>
          <Button
            size="large"
            type="default"
            // onClick={startCounter}
            onClick={() => router.push("/h5/register")}
            block
          >
            注册
          </Button>
        </Form.Item>
        {/* <Form.Item>
          <Button
            size="large"
            type="default"
            onClick={closeApp}
            danger
            // onClick={toogleCounter}
            block
          >
            关闭应用
          </Button>
        </Form.Item> */}
      </Form>
    </div>
  );
}
