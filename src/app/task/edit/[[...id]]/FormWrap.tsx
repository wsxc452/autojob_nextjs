"use client";
import { getTask } from "@/service/task";
import TaskForm from "@/components/Task/Form";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TaskItem } from "@/types";
export default function FormWrap({ id }: { id?: number }) {
  // const params = useParams();
  // console.log("id", params);
  // const id = params.id as string;
  // 查询出数据,
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["task", id],
    queryFn: (_context: QueryFunctionContext) => getTask(id),
    retry: 1,
    enabled: !!id,
  });
  if (isError) {
    throw error;
  }

  const [initialValues, setInitialValues] = useState<TaskItem>({
    id: 0,
    title: "",
    salary: "",
    position: [],
    staffnum: "",
    filteredKeywords: [],
    oid: "",
  });

  useEffect(() => {
    console.log("data", data);
    if (data) {
      setInitialValues(data); // 仅在 data 变化时更新 initialValues
    }
  }, [data]);

  // 传进去
  return (
    <>
      <TaskForm
        initialValues={!!id ? initialValues : undefined}
        isLoading={isLoading}
      />
    </>
  );
}
