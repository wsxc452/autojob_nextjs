"use client";
import { getList } from "@/service/pachong";
import { SearchFormType } from "@/types";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";

export const usePTask = (
  initialPage = 1,
  initialPageSize = 10,
  searchForm: SearchFormType,
) => {
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialPageSize,
    total: 0,
    showTotal: (total: number) => `总共 ${total} 条数据`,
  });

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      "pTaskSearch",
      pagination.current,
      pagination.pageSize,
      searchForm,
    ],
    queryFn: () => getList(pagination.current, pagination.pageSize, searchForm),
    initialData: {
      data: {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
      },
      status: 0,
    },
    retry: 1,
  });
  useEffect(() => {
    console.log("====data", data);
    setPagination((prev) => ({
      ...prev,
      total: data.data.pagination?.total || 0,
    }));
  }, [data]);
  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      showTotal: (total: number) => `Total ${total} items`,
    });
  };

  return {
    data: data.data,
    error,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
    refetch,
  };
};
