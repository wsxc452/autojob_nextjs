"use client";
import React from "react";

import { Button, Space, Table, Popconfirm } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import Link from "next/link";
import { delItem } from "@/service/users";
import message from "@/utils/antdMessage";
import { CardType, Search } from "@prisma/client";
import { useSearch } from "@/hooks/useSearch";
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
const expandedRowRender = (record: any) => {
  console.log("expandedRowRender", record);
  const columns: TableColumnsType<ExpandedDataType> = [
    { title: "任务执行No", dataIndex: "autoThreadNo", key: "autoThreadNo" },
    { title: "职位描述", dataIndex: "descText", key: "descText" },
    {
      title: "职位命中关键字",
      dataIndex: "whiteInfo",
      key: "whiteInfo",
      width: "200px",
    },
    {
      title: "过滤命中关键字",
      dataIndex: "blackInfo",
      key: "blackInfo",
      width: "200px",
    },
  ];
  const data = [];
  data.push({
    key: record.id,
    autoThreadNo: record.autoThreadNo,
    descText: record.descText,
    whiteInfo: record.whiteInfo,
    blackInfo: record.blackInfo,
  });

  return (
    <div className="p-5">
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
    title: "任务编号",
    dataIndex: "autoThreadNo",
    key: "autoThreadNo",
  },
  {
    title: "任务ID",
    dataIndex: "taskId",
    key: "taskId",
  },
  {
    title: "职位",
    dataIndex: "position",
    key: "position",
    // render: (text) => <a>{text}</a>,
  },
  {
    title: "公司",
    dataIndex: "company",
    key: "company",
    // render: (text) => <a>{text}</a>,
  },
  {
    title: "薪水",
    dataIndex: "salary",
    key: "salary",
  },
  {
    title: "投递成功",
    dataIndex: "isCanPost",
    key: "isCanPost",
    render: (_, record) => <span>{record.isCanPost ? "是" : "否"}</span>,
  },
  {
    title: "失败原因",
    dataIndex: "errDesc",
    key: "errDesc",
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
  {
    title: "花费",
    dataIndex: "costPoint",
    key: "costPoint",
    // render: (text) => <a>{text}</a>,
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
export default function SearchList({ searchForm }: any) {
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
  } = useSearch(1, 10, searchForm);

  const delTask = async (id: number) => {
    try {
      await delItem(id);
      message.success("删除成功");
    } catch (error) {
      console.error(error);
      message.error("删除失败");
    }
  };

  console.log("searchForm", searchForm);

  return (
    <div className="dark:bg-gray-800 flex flex-col ">
      <Table
        className="custom-table"
        columns={columns}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
        dataSource={data?.data.data || []}
        rowKey={(record) => record.id}
        pagination={pagination}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
      />
    </div>
  );
}
