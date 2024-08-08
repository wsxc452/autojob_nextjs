"use client";
import React from "react";

import { Button, Space, Table, Popconfirm, Card, Skeleton } from "antd";
import type { TableProps } from "antd";
import { useTasks } from "@/hooks/useTask";
import Link from "next/link";
import { deleteTask } from "@/service/task";
import message from "@/utils/antdMessage";
import { useRouter } from "next/navigation";
import { doIpc } from "@/app/(h5)/common/util";
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
export default function TaskList() {
  const router = useRouter();
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
  } = useTasks(1, 10);

  console.log(data);

  const clickTask = (id: number) => {
    router.push(`/h5/index/${id}`);
  };

  const delTask = async (id: number) => {
    try {
      await deleteTask(id);
      message.success("删除成功");
      refetch();
    } catch (error) {
      console.error(error);
      message.error("删除失败");
    }
  };
  const columns: ColumnsType<DataType> = [
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
      title: "岗位",
      dataIndex: "position",
      key: "position",
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
            <Link href={`/task/edit/${record.id}`}>编辑</Link>
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

  const openPcWeb = () => {
    //调用chrome原生方法打开后台
    doIpc("openChromeUrl", "http://localhost:3000");
  };
  return (
    <div className="flex w-screen flex-col items-center justify-center overflow-x-hidden">
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center px-10 py-15">
          <Skeleton active />
        </div>
      ) : (
        <div className="flex  w-full flex-col gap-2 px-5 py-10">
          {data.data.data.length === 0 && (
            <div className="gp-5 flex flex-col justify-center">
              <div className="my-5 text-center">暂无数据,请去后台配置</div>
              <Button onClick={openPcWeb}>打开后台</Button>
            </div>
          )}
          {data.data?.data &&
            data.data?.data.map((item) => {
              return (
                <Card
                  key={item.id}
                  title={item.title}
                  bordered={false}
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  <p>薪资范围: {item.salary} </p>
                  <p>匹配关键字: {item.positionKeywords.join(",")} </p>
                  <p>
                    过滤关键字:{" "}
                    {item.filteredKeywords
                      .map((item) => item.keyword)
                      .join(",")}{" "}
                  </p>

                  <div className="mt-2 text-right">
                    <Button onClick={() => clickTask(item.id)} type="primary">
                      开始投递
                    </Button>
                  </div>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
