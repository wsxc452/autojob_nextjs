"use client";
import { getTask } from "@/service/task";
import TaskForm from "@/app/pc/components/Task/Form";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TaskItem, TaskItemForm } from "@/types";
export default function FormWrap({ id }: { id?: number }) {
  // const params = useParams();
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

  const [initialValues, setInitialValues] = useState<TaskItemForm>({
    id: 0,
    title: "",
    salary: {
      maxMoney: "",
      minMoney: "",
    },
    staffnum: "",
    passCompanys: [],
    positionKeywords: [],
    filteredKeywords: [],
    userId: "",
    maxCount: 0,
    cityCode: "",
    cityName: "",
    searchText: "",
    activeCheck: false,
    bossOnlineCheck: false,
    headhunterCheck: false,
    experienceValue: [], // 经验要求
    degreeValue: [], // 学历要求
    salaryValue: "", // 薪资要求
    scaleValue: [], // 公司规模要求
  });

  useEffect(() => {
    console.log("data", data);
    if (data && data.data) {
      const minMoney = data.data?.salary.split("-")[0] || "";
      let maxMoney = "";
      if (data.data.salary.split("-")[1]) {
        maxMoney = data.data.salary.split("-")[1].replaceAll("K", "") || "";
      }
      const formData = Object.assign({}, data.data, {
        salary: {
          minMoney,
          maxMoney,
        },
        experienceValue: data.data.experienceValue.split(","),
        degreeValue: data.data.degreeValue.split(","),
        scaleValue: data.data.scaleValue.split(","),
      });
      console.log("formData===", formData);
      setInitialValues(formData); // 仅在 data 变化时更新 initialValues
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
