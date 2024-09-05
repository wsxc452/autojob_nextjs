"use client";
import { getTask } from "@/service/task";
import TaskForm from "@/app/pc/components/Task/Form";
import TaskFormMore from "@/app/pc/components/Task/FormMore";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { TaskItem, TaskItemForm } from "@/types";
import { Button, Form, Space, Tabs } from "antd";
import message from "@/utils/antdMessage";
import { createTask, updateTask } from "@/service/task";
import { getInitValue } from "./initValue";
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

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

  const [initialValues, setInitialValues] =
    useState<TaskItemForm>(getInitValue());

  const [isCreate, setIsCreate] = useState<boolean>(!initialValues);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  // const [formValue, setFormValue] = useState<any>(getInitValue());

  const baseForm = useRef<any>(null);
  const moreForm = useRef<any>(null);
  useEffect(() => {
    console.log("data", data);
    if (data && data.data) {
      let minMoney = "";
      let maxMoney = "";
      if (data.data.salary && data.data.salary.split("-").length === 2) {
        minMoney = data.data.salary.split("-")[0];
        maxMoney = data.data.salary.split("-")[1].replace("K", "");
      }
      const formData = Object.assign({}, data.data, {
        experienceValue: data.data.experienceValue.split(","),
        degreeValue: data.data.degreeValue.split(","),
        scaleValue: data.data.scaleValue.split(","),
        salary: {
          minMoney,
          maxMoney,
        },
      });
      console.log("formData===", formData);
      setInitialValues(formData); // 仅在 data 变化时更新 initialValues
    }
  }, [data]);

  const resetForm = () => {
    console.log("resetForm");
    baseForm.current?.resetFields();
    moreForm.current?.resetFields();
  };

  const onSubmit = async () => {
    console.log("baseForm", baseForm);
    const baseFormValues = await baseForm.current?.submit();
    console.log("baseFormValues", baseFormValues);
    const moreFormValues = await moreForm.current?.submit();
    console.log("moreFormValues", moreFormValues);

    const submitValueOri = Object.assign({}, baseFormValues, {
      hasMore: false,
      maxCount: parseInt(baseFormValues.maxCount) || 0,
    });
    console.log("submitValue", submitValueOri);
    let submitValue = submitValueOri;
    if (moreFormValues) {
      const {
        GreetingGroup,
        createdAt,
        updatedAt,
        title,
        search,
        greetings,
        userId,
        id,
        ...rest
      } = moreFormValues as TaskItem;

      submitValue = Object.assign({}, submitValue, rest, {
        // activeCheck: moreFormValues.activeCheck,
        // bossOnlineCheck: moreFormValues.bossOnlineCheck,
        // filteredKeywords: moreFormValues.filteredKeywords || [],
        // positionKeywords: moreFormValues.positionKeywords || [],
        // passCompanys: moreFormValues.passCompanys || [],
        salary:
          moreFormValues.salary.minMoney +
          "-" +
          moreFormValues.salary.maxMoney +
          "K",
        degreeValue: moreFormValues.degreeValue
          ? moreFormValues.degreeValue.join(",")
          : "",
        scaleValue: moreFormValues.scaleValue
          ? moreFormValues.scaleValue.join(",")
          : "",
        experienceValue: moreFormValues.experienceValue
          ? moreFormValues.experienceValue.join(",")
          : "",
        // cityName: moreFormValues.cityNameShow || "",
        // cityCode: moreFormValues.cityCode || "",
        hasMore: true,
      });
    } else {
      // submitValue = Object.assign({}, submitValue, {
      //   degreeValue: "",
      //   scaleValue: "",
      //   experienceValue: "",
      //   cityName: "",
      //   cityCode: "",
      // });
    }

    // const submitValue = {
    //   title: values.title,
    //   cityCode: values.cityCode,
    //   searchText: values.searchText,
    //   cityName: cityNameShow,
    // };
    console.log("111", submitValue);
    // if (submitValue.positionKeywords.length === 0) {
    //   message.error("职位关键字最少要添加一个!");
    //   setIsSubmiting(false);
    //   return;
    // }
    if (!id) {
      try {
        const ret = await createTask(submitValue);
        console.log("ret", ret);
        if (ret.status !== 200) {
          message.error(ret.data.error || "error!");
          return;
        }
        message.success("Success");
        resetForm();
      } catch (e: any) {
        message.success(e.message || "error!");
      }
    } else {
      try {
        const ret = await updateTask(id, submitValue);
        console.log("ret2", ret);
        if (ret.status !== 200) {
          message.error(ret.data.error || "error!");
          return;
        }
        message.success("Success");
      } catch (e: any) {
        message.success(e.message || "error!");
      }
    }
  };

  // 传进去
  return (
    <>
      <Tabs
        defaultActiveKey="base"
        items={[
          {
            key: "base",
            label: "基础设置",
            children: (
              <TaskForm
                ref={baseForm}
                initialValues={!!id ? initialValues : undefined}
                isLoading={isLoading}
              />
            ),
          },
          {
            key: "more",
            label: "高级设置",
            children: (
              <TaskFormMore
                ref={moreForm}
                initialValues={!!id ? initialValues : undefined}
                isLoading={isLoading}
              />
            ),
          },
        ]}
      />
      <Form.Item {...tailLayout}>
        <Space>
          <Button
            type="primary"
            // htmlType="submit"
            loading={isLoading || isSubmiting}
            disabled={isLoading || isSubmiting}
            onClick={onSubmit}
          >
            {!id ? "创建" : "更新"}
          </Button>
          <Button
            htmlType="button"
            onClick={resetForm}
            loading={isLoading || isSubmiting}
            disabled={isLoading || isSubmiting}
          >
            重置
          </Button>
        </Space>
      </Form.Item>
    </>
  );
}
