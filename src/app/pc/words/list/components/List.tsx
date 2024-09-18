"use client";
import React from "react";

import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { CardType } from "@prisma/client";
import { useWords } from "@/hooks/useWords";
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
const columns: ColumnsType<any> = [
  {
    title: "id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "word",
    dataIndex: "word",
    key: "word",
  },
  {
    title: "points",
    dataIndex: "points",
    key: "points",
  },
  {
    title: "type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "isBindUser",
    dataIndex: "isBindUser",
    key: "isBindUser",
  },
  {
    title: "最大次数",
    dataIndex: "maxCount",
    key: "maxCount",
  },
  {
    title: "剩余次数",
    dataIndex: "remainderCount",
    key: "remainderCount",
  },
  {
    title: "startTime",
    dataIndex: "startTime",
    key: "startTime",
    render: (text) => <span>{text && new Date(text).toLocaleString()}</span>,
  },
  {
    title: "endTime",
    dataIndex: "endTime",
    key: "endTime",
    render: (text) => <span>{text && new Date(text).toLocaleString()}</span>,
  },
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
export default function WordsList({ searchForm }: any) {
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
  } = useWords(1, 10, searchForm);

  return (
    <div className="dark:bg-gray-800 flex flex-col ">
      <Table
        className="custom-table"
        columns={columns}
        // expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
        dataSource={data?.data || []}
        rowKey={(record) => record.id}
        pagination={pagination}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
      />
    </div>
  );
}
