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
  const [formValue, setFormValue] = useState<any>({
    id: 0,
    title: "",
    salary: {
      minMoney: "",
      maxMoney: "",
    },
    // position: [],
    positionKeywords: [],
    staffnum: "",
    filteredKeywords: [],
    userId: "",
  });

  useEffect(() => {
    if (initialValues) {
      const newValue = {
        ...initialValues,
        salary: {
          minMoney: initialValues.salary.split("-")[0],
          maxMoney: initialValues.salary.split("-")[1],
        },
      };
      setFormValue(newValue);
      form.setFieldsValue(newValue);
    }
    setIsCreate(!initialValues);
  }, [initialValues, form]);

  const [inputPositionValue, setInputPositionValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  // const [filteredKeywords, setfilteredKeywords] = useState<Array<String>>([]);

  const [isShowFilter, setIsShowFilter] = React.useState(false);

  function getInitValue() {
    return {
      id: 0,
      title: "",
      salary: "",
      staffnum: "",
      filteredKeywords: [],
      positionKeywords: [],
      userId: "",
    } as TaskItem;
  }

  const userInfo = useSnapshot(globaStore.userInfo);

  console.log("formValue", formValue);

  const onFinish = async (values: any) => {
    console.log("111", values);
    setIsSubmiting(true);
    const submitValue = {
      title: values.title,
      salary: values.salary.minMoney + "-" + values.salary.maxMoney,
      filteredKeywords: formValue.filteredKeywords,
      positionKeywords: formValue.positionKeywords,
    };
    console.log("111", submitValue);
    if (formValue.positionKeywords.length === 0) {
      message.error("职位关键字最少要添加一个!");
      setIsSubmiting(false);
      return;
    }
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
  const onRemovePositon = (id: number) => {
    console.log(id);
    setFormValue(
      Object.assign({}, formValue, {
        positionKeywords: formValue.positionKeywords.filter(
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
    let filterArr = [];
    // 如果字符串中存在,分隔;说明是批量导入;
    const inpuValueTemp = inputValue.replaceAll("，", ",");
    if (inpuValueTemp.indexOf(",") !== -1) {
      filterArr = inpuValueTemp.split(",");
    } else {
      // 如果是一个一个输入的,则提示是否有重复
      filterArr[0] = inpuValueTemp;
      if (
        formValue.filteredKeywords.findIndex(
          (item) => item.keyword === inpuValueTemp,
        ) !== -1
      ) {
        message.info("过滤的公司已经存在");
        return;
      }
    }
    filterArr = filterArr.filter((item) => item.trim() !== "");
    const newPositions = filterArr.map((item) => {
      return {
        id: Date.now() + item,
        keyword: item,
      };
    }) as any;

    setFormValue(
      Object.assign({}, formValue, {
        filteredKeywords: formValue.filteredKeywords.concat(newPositions),
      }),
    );
    setInputValue("");
  };

  const validateMinMoney = (_: any, value: number) => {
    if (value < 0) {
      return Promise.reject(new Error("最小薪资不能小于0"));
    }
    return Promise.resolve();
  };

  const validateMaxMoney = (_: any, value: number) => {
    const minMoney = form.getFieldValue(["salary", "minMoney"]);
    if (value && minMoney && value <= minMoney) {
      return Promise.reject(new Error("最大薪资必须大于最小薪资"));
    }
    return Promise.resolve();
  };

  const addFilterPosition = () => {
    // check if the value is already in the list
    console.log("formValue", formValue);
    if (inputPositionValue.trim() === "") {
      message.info("请输入要职位关键字");
      return;
    }
    let positionArr = [];
    // 如果字符串中存在,分隔;说明是批量导入;
    const inputPositionValueTemp = inputPositionValue.replaceAll("，", ",");
    if (inputPositionValueTemp.indexOf(",") !== -1) {
      positionArr = inputPositionValueTemp.split(",");
    } else {
      // 如果是一个一个输入的,则提示是否有重复
      positionArr[0] = inputPositionValueTemp;
      if (
        formValue.positionKeywords.findIndex(
          (item) => item.keyword === inputPositionValueTemp,
        ) !== -1
      ) {
        message.info("职位关键字已经存在");
        return;
      }
    }
    positionArr = positionArr.filter((item) => item.trim() !== "");
    const newPositions = positionArr.map((item) => {
      return {
        id: Date.now() + item,
        keyword: item,
      };
    }) as any;

    setFormValue(
      Object.assign({}, formValue, {
        positionKeywords: formValue.positionKeywords.concat(newPositions),
      }),
    );
    setInputPositionValue("");
  };
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleInputPositionChange = (e: any) => {
    setInputPositionValue(e.target.value);
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
      <Form.Item label="薪资范围" required>
        <div className="flex flex-row   justify-start gap-4">
          <Form.Item
            name={["salary", "minMoney"]}
            rules={[
              { required: true, message: "请输入最低薪资" },
              { validator: validateMinMoney },
            ]}
          >
            <Input placeholder="从多少K" type="number" />
          </Form.Item>

          <div>-</div>
          <Form.Item
            name={["salary", "maxMoney"]}
            rules={[
              { required: true, message: "请输入最高薪资" },
              { validator: validateMaxMoney },
            ]}
          >
            <Input placeholder="到多少K" type="number" />
          </Form.Item>
          <div>单位为K(千), 填写0-99999则不限制</div>
        </div>
      </Form.Item>

      {/* <Form.Item
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
      </Form.Item> */}
      <Form.Item label="职位关键字">
        <div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                value={inputPositionValue}
                placeholder="请输入职位关键字,如销售,产品,本科。多个用关键词可以用,分隔; (用来跟公司职位描述去匹配)"
                maxLength={20}
                onChange={handleInputPositionChange}
                allowClear={true}
              />
            </div>
            <div className="col-span-1 flex items-center gap-2">
              <Button type="primary" size="small" onClick={addFilterPosition}>
                新增职位关键字
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-row flex-wrap gap-2 py-5">
            {(formValue.positionKeywords || []).length === 0 && (
              <span className="font-bold text-red">暂未设置</span>
            )}
            {(formValue.positionKeywords || []).map((position) => (
              <Tag
                key={position.id}
                closable
                onClose={() => {
                  onRemovePositon(position.id);
                }}
              >
                {position.keyword}
              </Tag>
            ))}
          </div>
        </div>
      </Form.Item>
      <Form.Item label="过滤公司名">
        <div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                value={inputValue}
                maxLength={20}
                onChange={handleInputChange}
                placeholder="请输入需要屏蔽的公司名,如:阿里巴巴,腾讯,百度。多个用关键词可以用,分隔;"
                allowClear={true}
              />
            </div>
            <div className="col-span-1 flex items-center gap-2">
              <Button type="primary" size="small" onClick={addFilter}>
                新增过滤公司名
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-row flex-wrap gap-2 py-5">
            {(formValue.filteredKeywords || []).length === 0 && (
              <span className="font-bold">暂未设置</span>
            )}
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
