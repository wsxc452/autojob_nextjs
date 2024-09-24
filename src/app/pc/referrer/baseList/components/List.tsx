"use client";
import React, { useMemo } from "react";

import { Button, Space, Table, Popconfirm } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import message from "@/utils/antdMessage";
import { CardType, Search } from "@prisma/client";
import { useUsers } from "@/hooks/useUsers";
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
interface ExpandedDataType {
  autoThreadNo: string;
  descText: string;
  whiteInfo: string;
  blackInfo: string;
}

// const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
export default function SearchList({ searchForm }: any) {
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
  } = useUsers(1, 10, searchForm);

  const columns: ColumnsType<any> = useMemo(() => {
    const openVip = async (record: any, type: string) => {
      const openVipRet = await fetch(`${ApiUrl}/cards/activeVip`, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: record.userId,
          isVip: type === "vip" ? "true" : "false",
          code: "test1232",
        }),
      });
      const retJson = await openVipRet.json();
      if (retJson.status !== 200) {
        message.error(retJson.data.message);
        return;
      } else {
        message.info("激活成功");
        refetch();
      }
    };

    return [
      {
        title: "id",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "userId",
        dataIndex: "userId",
        key: "userId",
      },
      {
        title: "是否激活推广人",
        width: "120px",
        dataIndex: "isReferrer",
        key: "isReferrer",
        render: (_, record) => <span>{record.isReferrer ? "是" : "否"}</span>,
      },
      {
        title: "是否激活高级推广人",
        dataIndex: "isVip",
        width: "120px",
        key: "isVip",
        render: (_, record) => <span>{record.isVip ? "是" : "否"}</span>,
      },
      {
        title: "推广code",
        dataIndex: "referrerCode",
        key: "referrerCode",
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
            {/* <Button>
              <Link href={`/pc/cards/disable/${record.id}`}>禁用</Link>
            </Button> */}

            <Popconfirm
              title="确认"
              description="确认开通?"
              onConfirm={() => openVip(record, "base")}
              okText="开通"
              cancelText="关闭"
            >
              <Button danger>开通推广人</Button>
            </Popconfirm>
            {/* <Popconfirm
              title="确认"
              description="确认开通?"
              onConfirm={() => openVip(record, "vip")}
              okText="开通"
              cancelText="关闭"
            >
              <Button danger>开通高级推广人</Button>
            </Popconfirm> */}
          </Space>
        ),
      },
    ];
  }, [refetch]);

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
