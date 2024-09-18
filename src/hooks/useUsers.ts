"use client";
import { getLists } from "@/service/users";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";
export type SearchFormType = {};

export const useUsers = (
  initialPage = 1,
  initialPageSize = 10,
  searchForm?: SearchFormType,
) => {
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialPageSize,
    total: 0,
  });

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["users", pagination.current, pagination.pageSize, searchForm],
    queryFn: () =>
      getLists(pagination.current, pagination.pageSize, searchForm),
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
