"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Space, App, Tag } from "antd";
import type { SelectProps } from "antd";
import { TaskItem } from "@/types";
import { createTask, updateTask } from "@/service/task";
import globaStore from "@/states/globaStore";
import { useSnapshot } from "valtio";
import message from "@/utils/antdMessage";
const posOptions: SelectProps["options"] = [
  {
    label: "front-end",
    value: "front-end",
  },
  {
    label: "后端",
    value: "后端",
  },
  {
    label: "全栈",
    value: "全栈",
  },
  {
    label: "react",
    value: "react",
  },
  {
    label: "vue",
    value: "vue",
  },
  {
    label: "Node",
    value: "Node",
  },
];
const salayOptions: SelectProps["options"] = [
  {
    label: "不限制",
    value: "0-0K",
  },
  {
    label: "8K以下",
    value: "0-8K",
  },
  {
    label: "8-12K",
    value: "8-12k",
  },
  {
    label: "12-18K",
    value: "12-18K",
  },
  {
    label: "18K-22K",
    value: "18000-22000",
  },
  {
    label: "22L-25K",
    value: "22000-25000",
  },
  {
    label: "25K-30K",
    value: "25-30K",
  },
  {
    label: "30K以上",
    value: "30K+",
  },
];

const staffNumOptions: SelectProps["options"] = [
  {
    label: "不限制",
    value: "0-0",
  },
  {
    label: "0-20人",
    value: "0-20",
  },
  {
    label: "20-50人",
    value: "20-50",
  },
  {
    label: "50-100人",
    value: "50-100",
  },
  {
    label: "100-500人",
    value: "100-500",
  },
  {
    label: "500以上",
    value: "500-999999",
  },
];
const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

type FormValues = {
  initialValues?: TaskItem;
  isLoading?: boolean;
};

const TaskForm: React.FC<FormValues> = ({
  initialValues,
  isLoading = false,
}) => {
  const [form] = Form.useForm();
  const [isCreate, setIsCreate] = useState<boolean>(!initialValues);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<TaskItem>({
    id: 0,
    title: "",
    salary: "",
    position: [],
    staffnum: "",
    filteredKeywords: [],
    oid: "",
  });

  useEffect(() => {
    if (initialValues) {
      const newValue = {
        ...initialValues,
      } as TaskItem;
      setFormValue(newValue);
      form.setFieldsValue(newValue);
    }
    setIsCreate(!initialValues);
  }, [initialValues, form]);

  const [inputValue, setInputValue] = useState("");
  // const [filteredKeywords, setfilteredKeywords] = useState<Array<String>>([]);

  const [isShowFilter, setIsShowFilter] = React.useState(false);

  function getInitValue() {
    return {
      id: 0,
      title: "",
      salary: "",
      position: [],
      staffnum: "",
      filteredKeywords: [],
      oid: "",
    } as TaskItem;
  }

  const userInfo = useSnapshot(globaStore.userInfo);

  useEffect(() => {
    if (initialValues) {
      setFormValue(initialValues);
    }
  }, [initialValues]);
  console.log("formValue", formValue);
  const onFinish = async (values: any) => {
    setIsSubmiting(true);
    const submitValue = {
      ...values,
      position: values.position.join(","),
      filteredKeywords: formValue.filteredKeywords,
      oid: userInfo.id,
    };
    console.log("111", submitValue);
    if (isCreate) {
      try {
        await createTask(submitValue);
        message.success("Success");
        const newValue = getInitValue();
        setFormValue(newValue);
        form.setFieldsValue(newValue);
      } catch (e: any) {
        message.success(e.message || "error!");
      }
    } else {
      try {
        await updateTask(formValue.id, submitValue);
        message.success("Success");
      } catch (e: any) {
        message.success(e.message || "error!");
      }
    }
    setIsSubmiting(false);
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    console.log("onValuesChange", formValue, changedValues, allValues);
    setFormValue(Object.assign({}, formValue, allValues));
  };

  const onReset = () => {
    form.resetFields();
  };

  const onRemoveFilter = (id: number) => {
    console.log(id);
    setFormValue(
      Object.assign({}, formValue, {
        filteredKeywords: formValue.filteredKeywords.filter(
          (item) => item.id !== id,
        ),
      }),
    );
  };

  const addFilter = () => {
    // check if the value is already in the list
    console.log("formValue", formValue);
    if (inputValue.trim() === "") {
      message.info("请输入要过滤的公司关键字");
      return;
    }
    if (
      formValue.filteredKeywords.findIndex(
        (item) => item.keyword === inputValue,
      ) !== -1
    ) {
      message.info("已经存在");
      return;
    }
    setFormValue(
      Object.assign({}, formValue, {
        filteredKeywords: formValue.filteredKeywords.concat({
          id: Date.now(),
          keyword: inputValue,
        }),
      }),
    );
    // setfilteredKeywords([...filteredKeywords, inputValue]);
    setInputValue("");
  };
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  return (
    <Form
      className="w-full"
      {...layout}
      initialValues={formValue}
      // initialValues={{ salary: ["0-0"], job: ["前端"], componySize: ["0-0"] }}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      disabled={isLoading || isSubmiting}
      // style={{ maxWidth: 600 }}
      onValuesChange={(changedValues, allValues) => {
        onValuesChange(changedValues, allValues);
      }}
      // onFieldsChange={(e) => onGenderChange(e)}
    >
      <Form.Item name="title" label="标题" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="salary" label="薪资范围" rules={[{ required: true }]}>
        <Select
          style={{ width: 120 }}
          // onChange={handleChange}
          options={salayOptions}
        />
      </Form.Item>
      <Form.Item
        name="position"
        label="职位关键字"
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Please select"
          onChange={handleChange}
          options={posOptions}
        />
      </Form.Item>
      <Form.Item label="过滤公司名" rules={[{ required: false }]}>
        <div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Input
                value={inputValue}
                maxLength={20}
                onChange={handleInputChange}
                allowClear={true}
              />
            </div>
            <div className="col-span-1 flex items-center gap-2">
              <Button type="primary" size="small" onClick={addFilter}>
                新增
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-row flex-wrap gap-2 py-5">
            {(formValue.filteredKeywords || []).map((compony) => (
              <Tag
                key={compony.id}
                closable
                onClose={() => {
                  onRemoveFilter(compony.id);
                }}
              >
                {compony.keyword}
              </Tag>
            ))}
          </div>
        </div>
      </Form.Item>
      {/* <Form.Item name="staffnum" label="公司人数" rules={[{ required: true }]}>
        <Select
          style={{ width: 120 }}
          onChange={handleChange}
          options={staffNumOptions}
        />
      </Form.Item> */}
      <Form.Item {...tailLayout}>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading || isSubmiting}
            disabled={isLoading || isSubmiting}
          >
            {isCreate ? "创建" : "更新"}
          </Button>
          <Button
            htmlType="button"
            onClick={onReset}
            loading={isLoading || isSubmiting}
            disabled={isLoading || isSubmiting}
          >
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TaskForm;
