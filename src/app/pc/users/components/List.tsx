"use client";
import React from "react";
import { Button, Space, Table, Popconfirm } from "antd";
import type { TableProps } from "antd";
import { useUsers } from "@/hooks/useUsers";
import Link from "next/link";
import { delItem, updateUser } from "@/service/users";
import message from "@/utils/antdMessage";
import { UpdateUserType } from "@/types";
import { Users } from "@prisma/client";
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

  const disableItem = async (record: any, isAbnormal: boolean) => {
    try {
      const ret = await updateUser(
        {
          updateType: UpdateUserType.Disable,
          isAbnormal: !isAbnormal,
          email: record.email,
          fullName: record.fullName,
          lastName: record.lastName,
          firstName: record.firstName,
        },
        record.id,
      );
      if (ret.status === 200) {
        message.success("禁用成功");
        refetch();
      } else {
        console.error(ret);
        message.error("禁用失败");
      }

      refetch();
    } catch (error) {
      console.error(error);
      message.error("禁用失败");
    }
  };
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
  const columns: ColumnsType<any> = [
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
      title: "当前状态",
      dataIndex: "isAbnormal",
      key: "isAbnormal",
      render: (_, record) => (
        <span>{record.isAbnormal ? "已禁用" : "正常"}</span>
      ),
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
          <Button>
            <Link href={`/pc/user/edit/${record.id}`}>管理</Link>
          </Button>

          <Popconfirm
            title="确认"
            description="确认要禁用?"
            onConfirm={() => {
              disableItem(record, record.isAbnormal);
            }}
            okText="是"
            cancelText="否"
          >
            <Button danger={!record.isAbnormal} type="primary">
              {record.isAbnormal ? "启用" : "禁用"}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="删除确认"
            description="确认要删除?"
            onConfirm={() => {
              delTask(record.id);
            }}
            okText="是"
            cancelText="否"
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
