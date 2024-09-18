"use client";
import React, { useState } from "react";
import "./tableStyles.css"; // 引入自定义样式文件

import { Button, Space, Table, Popconfirm, Upload } from "antd";
import type { TableProps, UploadProps } from "antd";
import { useTasks } from "@/hooks/useTask";
import Link from "next/link";
import { deleteTask } from "@/service/task";
import message from "@/utils/antdMessage";
import { BaseUrl } from "@/base/base";
type ColumnsType<T extends object> = TableProps<T>["columns"];
type TablePagination<T extends object> = NonNullable<
  Exclude<TableProps<T>["pagination"], boolean>
>;
type TablePaginationPosition = NonNullable<
  TablePagination<any>["position"]
>[number];

// const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
export default function List() {
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
  } = useTasks(1, 10);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [currentId, setCurrentId] = useState(-1);
  const delTask = async (id: number) => {
    try {
      const ret = await deleteTask(id);
      console.log("ret", ret);
      if (ret.status !== 200) {
        message.error(ret.data.error || "删除失败");
        return;
      }
      message.success("删除成功");
      refetch();
    } catch (error) {
      console.error(error);
      message.error("删除失败");
    }
  };
  const downloadJSON = async (record: any) => {
    try {
      setDownloadLoading(true);
      setCurrentId(record.id);
      // 向 API 发送请求获取文件
      const res = await fetch(`${BaseUrl}/api/task/export/${record.id}`, {
        method: "GET",
        cache: "no-cache",
      });

      if (!res.ok) {
        message.error("下载失败");
        throw new Error("下载失败");
      }

      // 读取响应内容并将其转换为 Blob 对象
      const blob = await res.blob();

      // 生成一个 URL 对象并创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", record.searchText + ".json"); // 设置下载的文件名
      document.body.appendChild(link);
      link.click(); // 模拟点击下载文件
      link.remove(); // 移除链接
    } catch (error) {
      console.error("下载失败:", error);
      message.error("下载失败");
    } finally {
      setDownloadLoading(false);
      setCurrentId(-1);
    }
  };
  const onImport = () => {
    console.log("import");
  };
  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "searchText",
      dataIndex: "searchText",
      key: "searchText",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "打招呼分組",
      dataIndex: "greetingGroupId",
      key: "greetingGroupId",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "最大投递次数",
      dataIndex: "maxCount",
      key: "maxCount",
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
            <Link href={`/pc/task/index/${record.id}`}>执行</Link>
          </Button>
          <Button>
            <Link href={`/pc/task/edit/${record.id}`}>编辑</Link>
          </Button>
          <Button
            loading={record.id === currentId && downloadLoading}
            disabled={record.id === currentId && downloadLoading}
            onClick={() => downloadJSON(record)}
          >
            导出
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

  const handleUpload = async (file: File) => {
    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file as unknown as Blob); // 转换类型
    try {
      const response = await fetch(`${BaseUrl}/api/task/upload`, {
        method: "POST",
        cache: "no-cache",
        body: formData,
      });

      const result = await response.json();
      if (result.status !== 200) {
        message.error(result.data?.error || "上传失败");
        return;
      }
      message.success("新增成功");
      refetch();
    } catch (error) {
      message.error("上传失败");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="dark:bg-gray-800 flex flex-col ">
      <div className="mb-3">
        <Upload
          accept=".json"
          showUploadList={false}
          multiple={false}
          beforeUpload={(file) => {
            handleUpload(file);
            return false; // Prevent automatic upload
          }}
        >
          <Button disabled={uploadLoading} loading={uploadLoading}>
            导入
          </Button>
        </Upload>
      </div>
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
