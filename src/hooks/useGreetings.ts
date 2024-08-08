"use client";
import { getList } from "@/service/greetings";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";

export const useGreetings = (initialPage = 1, initialPageSize = 10) => {
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialPageSize,
    total: 0,
  });

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["greetings", pagination.current, pagination.pageSize],
    queryFn: () => getList(pagination.current, pagination.pageSize),
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
    setPagination((prev) => ({
      ...prev,
      total: data.data.pagination.total,
    }));
  }, [data]);
  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };

  return {
    data,
    error,
    isLoading,
    isFetching,
    pagination,
    handleTableChange,
    refetch,
  };
};
