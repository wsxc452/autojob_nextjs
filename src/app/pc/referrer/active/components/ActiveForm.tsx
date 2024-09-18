"use client";
import { useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import { ApiUrl } from "@/base/base";
import message from "@/utils/antdMessage";
import { userActions } from "@/app/pc/pcStates/pcStore";

type FieldType = {
  code?: string;
};

function ActiveForm({ type }: { type: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();
  const handleOk = async () => {
    const values = form.getFieldsValue();
    // console.log("form", values);
    if (values.code && values.code.length > 0) {
      // 提交激活推荐人
      const retInfo = await activeReferrer(values.code);
      console.log("====activeReferrer", retInfo);
      setIsModalOpen(false);
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const activeReferrer = async (code: string) => {
    const response = await fetch(`${ApiUrl}/cards/active`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    const retJson = await response.json();
    // console.log("====get", retJson);
    if (retJson.status !== 200) {
      message.error(retJson.data.message);
      return;
    }

    message.info("恭喜你,激活成功");
    userActions.syncUserInfo();
  };

  const onCheckIsCanActive = async () => {
    const response = await fetch(`${ApiUrl}/cards/isActive`, {
      cache: "no-cache",
    });
    const retJson = await response.json();
    console.log("====get", retJson);
    if (retJson.status !== 200) {
      return false;
    }
    return true;
  };

  const onActiveOne = async () => {
    if (type === "base") {
      // 检测是否满足激活条件,如果满足则打开弹窗
      const isActive = await onCheckIsCanActive();
      if (isActive) {
        setIsModalOpen(true);
      } else {
        message.info("请完成消费卡券后再来激活");
      }
    } else {
      message.info("请联系管理员开通高级推荐人,微信:v85039485");
    }

    // 弹窗提示输入推荐人code:
    // 输入后调用接口激活
    // 激活成功后提示激活成功
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Modal
        title="激活推荐人"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Form
          name="basic"
          form={form}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="推广编码"
            name="code"
            rules={[
              {
                required: true,
                message: "请输入一个自定义编码4-12位",
                min: 4,
                max: 12,
              },
            ]}
          >
            <Input placeholder="请输入一个推广code,如小明同学, love8888" />
          </Form.Item>
        </Form>
      </Modal>

      <Button
        type="primary"
        disabled={type === "vip"}
        danger={type === "vip"}
        onClick={onActiveOne}
      >
        {type === "base" ? "立即激活推荐人" : "暂未开发,敬请期待"}
      </Button>
    </div>
  );
}

export default ActiveForm;
