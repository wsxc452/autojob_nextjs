"use client";
import React from "react";

import { Button, Space, Table, Popconfirm } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import Link from "next/link";
import message from "@/utils/antdMessage";
import { CardType, Search } from "@prisma/client";
import { useRecord } from "@/hooks/useRecord";
import { TaskItem } from "@/types";
type ColumnsType<T extends object> = TableProps<T>["columns"];
type TablePagination<T extends object> = NonNullable<
  Exclude<TableProps<T>["pagination"], boolean>
>;
type TablePaginationPosition = NonNullable<
  TablePagination<any>["position"]
>[number];

interface DataType {
  id: number;
  title: string;
  code: string;
  type: CardType;
  value: number;
  createdBy: string;
  isActive: boolean;
  isRedeemed: boolean;
  createdAt: string;
  updatedAt: string;
  redeemedAt: string;
  distributorId: number;
  price: string;
}
interface ExpandedDataType {
  autoThreadNo: string;
  descText: string;
  whiteInfo: string;
  blackInfo: string;
}

const columns: ColumnsType<any> = [
  {
    title: "id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "userId",
    dataIndex: "userId",
    key: "userId",
    render: (_, record) => <a>{record.User.userId}</a>,
  },
  {
    title: "email",
    dataIndex: "email",
    key: "email",
    render: (_, record) => <a>{record.User.email}</a>,
  },
  {
    title: "cardType",
    dataIndex: "cardType",
    key: "cardType",
  },
  {
    title: "points",
    dataIndex: "points",
    key: "points",
    // render: (text) => <a>{text}</a>,
  },
  {
    title: "byResaon",
    dataIndex: "byResaon",
    key: "byResaon",
    // render: (text) => <a>{text}</a>,
  },

  // {
  //   title: "职位命中",
  //   dataIndex: "whiteInfo",
  //   key: "whiteInfo",
  //   // render: (text) => <a>{text}</a>,
  // },
  // {
  //   title: "过滤命中",
  //   dataIndex: "blackInfo",
  //   key: "blackInfo",
  //   // render: (text) => <a>{text}</a>,
  // },
  // {
  //   title: "isReferrer",
  //   dataIndex: "isReferrer",
  //   key: "isReferrer",
  //   render: (text) => <a>{text}</a>,
  // },
  {
    title: "时间",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => <span>{new Date(text).toLocaleString()}</span>,
  },
  // {
  //   title: "Action",
  //   key: "action",
  //   render: (_, record) => (
  //     <Space size="middle">
  //       <Button>
  //         <Link href={`/pc/cards/disable/${record.id}`}>作废</Link>
  //       </Button>
  //       <Popconfirm
  //         title="删除确认"
  //         description="确认要删除?"
  //         onConfirm={() => {
  //           delTask(record.id);
  //         }}
  //         okText="Yes"
  //         cancelText="No"
  //       >
  //         <Button disabled danger>
  //           删除
  //         </Button>
  //       </Popconfirm>
  //     </Space>
  //   ),
  // },
];
// const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
export default function RecordList({ searchForm, isReferrer = false }: any) {
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
  } = useRecord(
    1,
    10,
    Object.assign(searchForm, {
      isReferrer: isReferrer,
    }),
  );

  console.log("searchForm", searchForm);

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
