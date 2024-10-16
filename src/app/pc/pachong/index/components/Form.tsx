"use client";
import DebounceWrap from "@/app/pc/components/common/DebounceWrap";
import pcStore, { userActions } from "@/app/pc/pcStates/pcStore";
import { pachongCreate } from "@/service/pachong";
import message from "@/utils/antdMessage";
import { Button, Form, Input } from "antd";
import { useMemo, useState } from "react";
import { useSnapshot } from "valtio";

function PaChongForm() {
  const { userInfo } = useSnapshot(pcStore);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const onSumbit = async function (values: any) {
    try {
      setSubmitLoading(true);
      const ret = await pachongCreate(values.url, values.desc);
      if (ret.status === 200 && ret.data) {
        message.success(`成功创建任务`);
        form.resetFields();
      } else {
        message.error(ret.data.error || "创建任务失败 !");
      }
      console.log("ret", ret);
    } catch (e: any) {
      console.error(e);
      message.error(e.toString() || "创建任务失败 !");
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <div className="flex w-full flex-auto p-5 text-center">
      <Form
        className="w-full"
        onFinish={onSumbit}
        initialValues={{
          url: "",
          desc: "",
        }}
        form={form}
      >
        <Form.Item
          label="URL"
          name="url"
          rules={[{ required: true, message: "请输入url" }]}
        >
          <Input allowClear placeholder="请输入url" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="desc"
          rules={[{ required: false, message: "请输入描述" }]}
        >
          <Input allowClear placeholder="请输入描述" />
        </Form.Item>
        <Form.Item>
          <DebounceWrap debounceTime={1000}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={submitLoading}
              loading={submitLoading}
            >
              创建任务
            </Button>
          </DebounceWrap>
        </Form.Item>
      </Form>
    </div>
  );
}

export default PaChongForm;
