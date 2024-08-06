"use client";
import { Alert, Form, Input, Button } from "antd";

function getUserInfo() {
  return new Promise((resolve, reject) => {});
}
function CardPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Form
        name="trigger"
        style={{ maxWidth: 700 }}
        layout="vertical"
        autoComplete="off"
        initialValues={{ balence: "0", field_a: "XSSDSS5514S" }}
      >
        {/* <Alert message="Use 'max' rule, continue type chars to see it" /> */}

        <Form.Item label="当前余额" name="balence" rules={[{ max: 3 }]}>
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="卡密账户"
          name="field_a"
          validateTrigger="onBlur"
          rules={[{ max: 3 }]}
        >
          <Input placeholder="请输入卡密" />
        </Form.Item>

        <Button block type="primary">
          充值
        </Button>
      </Form>
    </div>
  );
}

export default CardPage;
