"use client";
import React from "react";
import "./tableStyles.css"; // 引入自定义样式文件

import { Button, Space, Table, Popconfirm } from "antd";
import type { TableProps } from "antd";
import { useUsers } from "@/hooks/useUsers";
import Link from "next/link";
import { delItem } from "@/service/users";
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
  } = useUsers(1, 10);

  const delTask = async (id: number) => {
    try {
      await delItem(id);
      message.success("删除成功");
      refetch();
    } catch (error) {
      console.error(error);
      message.error("删除失败");
    }
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "fullName",
      dataIndex: "fullName",
      key: "fullName",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button disabled>
            <Link href={`/user/edit/${record.id}`}>编辑</Link>
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
            <Button disabled danger>
              删除
            </Button>
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
