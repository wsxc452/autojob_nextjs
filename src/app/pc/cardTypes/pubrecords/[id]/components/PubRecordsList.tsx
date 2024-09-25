"use client";
import React, { useEffect, useState } from "react";

import type { TableColumnsType, TableProps } from "antd";
import { CardType, Cards } from "@prisma/client";
import { useWords } from "@/hooks/useWords";
import { useParams } from "next/navigation";
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
type dataType = {
  unRedeemed: number;
  total: number;
  cards: Cards[];
};
// const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
export default function RecordsList({ searchForm }: any) {
  const { id } = useParams();

  const [data, setData] = useState<dataType>({
    unRedeemed: 0,
    total: 0,
    cards: [],
  });

  useEffect(() => {
    const getRecords = async () => {
      const result = await fetch(`${ApiUrl}/pubrecords?id=${id}`);
      const data = await result.json();
      console.log("data", data);
      setData(data.data);
    };
    getRecords();
  }, []);

  return (
    <div className="dark:bg-gray-800 flex flex-col ">
      <div className="p-5">
        尚未使用的code: {data.unRedeemed}
        已经使用的code: {data.total - data.unRedeemed}
        总的code: {data.total}
      </div>
      <div className="flex w-full   text-wrap p-5 text-left ">
        <div
          className="long-string text-wrap"
          style={{
            maxWidth: "100%",
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {data.cards.map((item) => (
            <div key={item.id}>{item.code}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
