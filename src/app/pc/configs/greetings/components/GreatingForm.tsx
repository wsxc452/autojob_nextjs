"use client";

import { useGreetingGroup } from "@/hooks/useGreetingGroup";
import { useGreetings } from "@/hooks/useGreetings";
import { createItem, deleteItem, updateItem } from "@/service/greetings";
import message from "@/utils/antdMessage";
import { Greetings, GreetingsType } from "@prisma/client";
import {
  Button,
  Flex,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import { useEffect, useState } from "react";

function GreatingForm() {
  const [form] = Form.useForm();
  const [groupOptions, setGroupOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const { data: groupData, isLoading: groupIsLoading } = useGreetingGroup(
    1,
    10,
  );
  useEffect(() => {
    if (!groupIsLoading) {
      const options = groupData?.data.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setGroupOptions(options);
    }
  }, [groupData, groupIsLoading]);
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
  } = useGreetings(1, 10);
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

  const doDisable = async (id: number, record: Greetings) => {
    console.log("updateItem", id);
    try {
      const res = await updateItem(id, {
        status:
          record.status === GreetingsType.DEACTIVE
            ? GreetingsType.ACTICE
            : GreetingsType.DEACTIVE,
      });
      if (res.status === 200) {
        message.info("修改成功");
        refetch();
      } else {
        console.error(res);
        message.error("修改失败");
      }
    } catch (e) {
      console.log(e);
      message.error("修改失败");
    }
  };

  const onFinish = (values: any) => {
    console.log("Finish:", values);
    if (data?.data.data && data.data.data.length >= 10) {
      message.error("最多10条");
      return;
    }
    try {
      createItem({
        content: values.content,
        greetingGroupId: values.greetingGroupId,
      }).then((res) => {
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
      title: "content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "分组",
      dataIndex: "greetingGroupId",
      key: "greetingGroupId",
      render: (_: string, record: any) => (
        <span>{record.GreetingGroup.name}</span>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Greetings) => (
        <Space size="middle">
          <Popconfirm
            title="确认"
            description="确认要禁用?"
            onConfirm={() => {
              doDisable(record.id, record);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type={
                record.status === GreetingsType.DEACTIVE ? "primary" : "default"
              }
            >
              {record.status === GreetingsType.ACTICE ? "禁用" : "启用"}
            </Button>
          </Popconfirm>

          <Popconfirm
            title="删除确认"
            description="确认要删除?"
            onConfirm={() => {
              delTask(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              // disabled={(record as any).GreetingGroup.name === "默认"}
              danger
            >
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
        <div className="py-5">Tips: 最多10条,请至少保留一条,否则无法打招呼</div>

        <Form
          form={form}
          layout="inline"
          onFinish={onFinish}
          style={{
            width: "100%",
          }}
        >
          <Form.Item
            label="新增招呼语句"
            name="content"
            style={{
              width: "50%",
            }}
            rules={[
              { required: true, message: "请输入打招呼语句" },
              { min: 5, message: "不能少于5个字符" },
              { max: 100, message: "不能超过100个字符" },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            label="分组"
            name="greetingGroupId"
            style={{
              width: "30%",
            }}
            rules={[{ required: true, message: "请选择分组" }]}
          >
            <Select
              allowClear
              style={{ width: 120, fontSize: "12px" }}
              // onChange={handleChange}
              options={groupOptions}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              新增
            </Button>
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

export default GreatingForm;
