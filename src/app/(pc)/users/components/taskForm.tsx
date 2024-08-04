"use client";
import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, FormInstance } from "antd";
import {
  QueryFunctionContext,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getTask, updateTask } from "@/service/task";
import { TaskItem } from "@/types";
import { useParams } from "next/navigation";

function TaskForm() {
  const { id } = useParams();
  const FormRef = useRef<FormInstance>(null);
  const taskInit = {
    id: parseInt(id as string),
    title: "",
    salary: "",
    position: [],
    staffnum: "",
    filteredKeywords: [],
    oid: "",
  } as TaskItem;
  const [initialValues, setInitialValues] = useState(taskInit);
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["task", id],
    queryFn: (_context: QueryFunctionContext) =>
      getTask(parseInt(id as string)),
    retry: 1,
  });
  if (isError) {
    throw error;
  }

  useEffect(() => {
    console.log("data===", data);
    if (data?.data) {
      setInitialValues(data.data); // 仅在 data 变化时更新 initialValues
      FormRef && FormRef.current?.setFieldsValue(data.data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (newTodo: Partial<TaskItem>) => {
      return updateTask(initialValues.id, newTodo);
    },
    onSuccess: (data, variables, context) => {
      // Boom baby!
      console.log("success");
    },
  });
  // mutate("updateTask", {
  //   onSuccess: (data) => {
  //     console.log(data);
  //   },
  //   onError: (error) => {
  //     console.error(error);
  //   },
  //   onSettled: () => {
  //     console.log("settled");
  //   },
  // });

  const onFinish = (values: Partial<TaskItem>) => {
    console.log("values", values);
    mutation.mutate(values);
  };

  return (
    <Form
      name="task_form"
      ref={FormRef}
      onFinish={onFinish}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      initialValues={initialValues}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please input job title!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Salary"
        name="salary"
        rules={[{ required: true, message: "Please input job salary!" }]}
      >
        <Input value={initialValues.salary} />
      </Form.Item>
      <Form.Item
        label="Position"
        name="position"
        rules={[{ required: true, message: "Please input job position!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Staff Number"
        name="staffnum"
        rules={[{ required: true, message: "Please input staff number!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
export default TaskForm;
