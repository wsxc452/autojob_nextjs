"use client";
import React from "react";

import { Button, Space, Table, Popconfirm } from "antd";
import type { TableProps } from "antd";
import { useCardTypes } from "@/hooks/useCardTypes";
import Link from "next/link";
import message from "@/utils/antdMessage";
import { CardType, CardTypes } from "@prisma/client";
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
export default function CardTypesList() {
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
  } = useCardTypes(1, 10);

  const columns: ColumnsType<CardTypes> = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "点数",
      dataIndex: "cValue",
      key: "cValue",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      // render: (text) => <a>{text}</a>,
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
            <Link href={`/pc/cardTypes/publish/${record.id}`}>发券</Link>
          </Button>
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
