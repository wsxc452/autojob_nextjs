"use client";
import React from "react";
import "./tableStyles.css"; // 引入自定义样式文件

import { Button, Space, Table, Popconfirm } from "antd";
import type { TableProps } from "antd";
import { useTasks } from "@/hooks/useTask";
import Link from "next/link";
import { deleteTask } from "@/service/task";
import message from "@/utils/antdMessage";
type ColumnsType<T extends object> = TableProps<T>["columns"];
type TablePagination<T extends object> = NonNullable<
  Exclude<TableProps<T>["pagination"], boolean>
>;
type TablePaginationPosition = NonNullable<
  TablePagination<any>["position"]
>[number];

interface DataType {
  id: number;
  title: String;
  salary: String;
  position: Array<string>;
  staffnum: String;
}

// const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
export default function List() {
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
  } = useTasks(1, 10);

  const delTask = async (id: number) => {
    try {
      const ret = await deleteTask(id);
      console.log("ret", ret);
      if (ret.status !== 200) {
        message.error(ret.data.error || "删除失败");
        return;
      }
      message.success("删除成功");
      refetch();
    } catch (error) {
      console.error(error);
      message.error("删除失败");
    }
  };
  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "title",
      dataIndex: "title",
      key: "title",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "薪资",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "城市",
      dataIndex: "cityName",
      key: "cityName",
    },
    {
      title: "最大投递次数",
      dataIndex: "maxCount",
      key: "maxCount",
    },
    // {
    //   title: "公司人数",
    //   dataIndex: "staffnum",
    //   key: "staffnum",
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button>
            <Link href={`/pc/task/edit/${record.id}`}>编辑</Link>
          </Button>
          <Popconfirm
            title="删除确认"
            description="确认要删除?"
            onConfirm={() => {
              delTask(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div className="dark:bg-gray-800 flex flex-col ">
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
  );
}
