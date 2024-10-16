"use client";
import React from "react";

import { Button, Popconfirm, Space, Table, message } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { CardType } from "@prisma/client";
import { usePTask } from "@/hooks/usePTask";
import Link from "next/link";
import DebounceWrap from "@/app/pc/components/common/DebounceWrap";
import { ApiUrl } from "@/base/base";
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
async function exportXml(taskId: number) {
  // `${ApiUrl}/pachong/xml?id=${record.id}`
  //
  const getUrl = `${ApiUrl}/pachong/xml?id=${taskId}`;
  // create href and click

  fetch(getUrl)
    .then((response) => {
      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        console.log("contentType", contentType);
        if (contentType !== "application/json") {
          // 如果是下载响应，进行下载
          response.blob().then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `export_taskId_${taskId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          });
        } else {
          // 如果是错误响应，处理错误信息
          response.json().then((data) => {
            console.error(data);
            message.error(data.data?.error || "下载失败");
          });
        }
      } else {
        // 处理非 2xx 状态码的错误
        console.error("请求出错");
      }
    })
    .catch((error) => {
      console.error("网络错误", error);
    });

  // const retJson = await retData.json();
  // console.log("retJson", retJson);
  // how to download file
  // const a = document.createElement("a");
}

const columns: ColumnsType<any> = [
  {
    title: "id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "pageUrl",
    dataIndex: "pageUrl",
    key: "pageUrl",
  },
  {
    title: "desc",
    dataIndex: "desc",
    key: "desc",
  },
  {
    title: "时间",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => <span>{new Date(text).toLocaleString()}</span>,
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <DebounceWrap debounceTime={2000}>
          <Button>
            <Link href={`/pc/pachong/task/${record.id}`}>执行</Link>
          </Button>
        </DebounceWrap>
        <DebounceWrap debounceTime={2000}>
          <Button onClick={() => exportXml(record.id)}>导出excel</Button>
        </DebounceWrap>
        {/* <Popconfirm
          title="删除确认"
          description="确认要删除?"
          onConfirm={() => {
            delTask(record.id);
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>删除</Button>
        </Popconfirm> */}
      </Space>
    ),
  },
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
  } = usePTask(1, 10, searchForm);

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
function delTask(id: any) {
  throw new Error("Function not implemented.");
}
