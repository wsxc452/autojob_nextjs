"use client";

import { useGreetingGroup } from "@/hooks/useGreetingGroup";
import { createItem, deleteItem } from "@/service/greetingGroup";
import message from "@/utils/antdMessage";
import { GreetingGroup } from "@prisma/client";
import { Button, Col, Form, Input, Popconfirm, Row, Space, Table } from "antd";
import { useEffect } from "react";

function GreatingGroupForm() {
  const [form] = Form.useForm();

  const {
    data,
    refetch,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
  } = useGreetingGroup(1, 10);
  useEffect(() => {}, []);

  const delTask = async (id: number) => {
    console.log("delTask", id);
    try {
      const res = await deleteItem(id);
      if (res.status === 200) {
        message.info("删除成功");
        refetch();
      } else {
        console.error(res);
        message.error("删除失败");
      }
    } catch (e) {
      console.log(e);
      message.error("删除失败");
    }
  };

  const onFinish = (values: any) => {
    console.log("Finish:", values);
    if (data?.data.data && data.data.data.length >= 10) {
      message.error("最多10条");
      return;
    }
    try {
      createItem({ name: values.name }).then((res) => {
        if (res.status === 200) {
          message.info("新增成功");
          form.resetFields();
          refetch();
        } else {
          console.error(res);
          message.error("新增失败");
        }
      });
    } catch (e) {
      message.error("新增失败");
    }
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: GreetingGroup) => (
        <Space size="middle">
          <Popconfirm
            title="删除确认"
            description="确认要删除?"
            onConfirm={() => {
              delTask(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button disabled={record.name === "默认"} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-5 w-full">
        <div className="py-5">Tips: 最多10条</div>
        <Form
          form={form}
          layout="inline"
          onFinish={onFinish}
          style={{
            width: "100%",
          }}
        >
          <Form.Item
            label="分组"
            name="name"
            style={{}}
            rules={[{ required: true, message: "请输入分组名称" }]}
          >
            <Input allowClear placeholder="请输入分组名称" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              新增
            </Button>
            &nbsp; 方便不同的任务选择不同的分组,如"默认","礼貌","热情"等
          </Form.Item>
        </Form>
      </div>
      <div>
        <Table
          className="custom-table"
          columns={columns}
          dataSource={data?.data.data || []}
          rowKey={(record) => record.id}
          pagination={pagination}
          loading={isLoading || isFetching}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
}

export default GreatingGroupForm;
