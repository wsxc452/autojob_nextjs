"use client";
import React from "react";

import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { CardType } from "@prisma/client";
import { useWordsRecord } from "@/hooks/useWordsRecord";
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
const expandedRowRender = (record: any) => {
  const columns: TableColumnsType<ExpandedDataType> = [
    {
      title: "bindUserId",
      dataIndex: "bindUserId",
      key: "bindUserId",
      width: "120px",
    },
    {
      title: "bindUserEmail",
      dataIndex: "bindUserEmail",
      key: "bindUserEmail",
      width: "120px",
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
      width: "500px",
      render: (text) => <div className="w-[500px] text-wrap">{text}</div>,
    },
  ];
  const data: any = [];
  data.push({
    key: record.id,
    startTime: record.startTime,
    endTime: record.endTime,
    bindUserId: record.bindUserId,
    bindUserEmail: record.bindUserEmail,
    desc: record.wordInfo,
  });
  return (
    <div className="w-full  overflow-auto rounded-sm bg-white p-3">
      <Table columns={columns} dataSource={data} pagination={false}></Table>
    </div>
  );
};

const columns: ColumnsType<any> = [
  {
    title: "id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "wordCode",
    dataIndex: "wordCode",
    key: "wordCode",
  },
  {
    title: "email",
    dataIndex: "email",
    key: "email",
    render: (_, record) => <span>{record.User.email}</span>,
  },
  {
    title: "points",
    dataIndex: "points",
    key: "points",
  },
  {
    title: "money",
    dataIndex: "money",
    key: "money",
  },
  {
    title: "type",
    dataIndex: "cardType",
    key: "type",
  },
  {
    title: "isBindUser",
    dataIndex: "bindUserId",
    key: "isBindUser",
    render: (_, record) => <span>{_ ? "是" : "否"}</span>,
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
export default function ChargeList({ searchForm }: any) {
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
  } = useWordsRecord(1, 10, searchForm);

  return (
    <div className="dark:bg-gray-800 flex flex-col ">
      <Table
        className="custom-table"
        columns={columns}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
        dataSource={data?.data || []}
        rowKey={(record) => record.id}
        pagination={pagination}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
      />
    </div>
  );
}
