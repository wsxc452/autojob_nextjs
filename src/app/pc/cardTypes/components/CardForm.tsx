"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  App,
  Tag,
  Switch,
  Radio,
} from "antd";
import type { RadioChangeEvent, SelectProps } from "antd";
import { createItem, updateItem } from "@/service/cardTypes";
import globaStore from "@/states/globaStore";
import { useSnapshot } from "valtio";
import message from "@/utils/antdMessage";
import { CardType, CardTypes } from "@prisma/client";
const { TextArea } = Input;

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
    label: "日卡",
    value: "DAILY",
  },
  {
    label: "月卡",
    value: "MONTHLY",
  },
  {
    label: "季卡",
    value: "12-18K",
  },
  {
    label: "半年卡",
    value: "12-18K",
  },
  {
    label: "年卡",
    value: "18000-22000",
  },
  {
    label: "点卡",
    value: "POINTS",
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
  initialValues?: CardTypes;
  isLoading?: boolean;
};

function getInitValue() {
  return {
    id: 0,
    name: "新人体验卡券,每人只限一次,1000点券",
    type: CardType.POINTS,
    price: 100,
    cValue: 1000,
    desc: "新人体验卡券,每人只限一次,1000点券",
    rebate: 0,
    onlyOneTime: true,
    isCanDistributor: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
const initValue = getInitValue();
const CardsForm: React.FC<FormValues> = ({
  initialValues,
  isLoading = false,
}) => {
  const [form] = Form.useForm();
  const [isCreate, setIsCreate] = useState<boolean>(!initialValues);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<CardTypes>(initValue);

  useEffect(() => {
    if (initialValues) {
      const newValue = {
        ...initialValues,
      };
      setFormValue(newValue);
      form.setFieldsValue(newValue);
    }
    setIsCreate(!initialValues);
  }, [initialValues, form]);

  const [inputValue, setInputValue] = useState("");
  // const [filteredKeywords, setfilteredKeywords] = useState<Array<String>>([]);

  const [isShowFilter, setIsShowFilter] = React.useState(false);

  const { userInfo } = useSnapshot(globaStore);

  useEffect(() => {
    if (initialValues) {
      setFormValue(initialValues);
    }
  }, [initialValues]);
  console.log("formValue", formValue);
  const onFinish = async (values: any) => {
    console.log("Success:", values);
    setIsSubmiting(true);
    const submitValue = {
      ...formValue,
      ...values,
    };
    console.log("111", submitValue);
    if (isCreate) {
      try {
        await createItem(submitValue);
        message.success("Success");
        const newValue = getInitValue();
        setFormValue(newValue);
        form.setFieldsValue(newValue);
      } catch (e: any) {
        message.success(e.message || "error!");
      }
    } else {
      try {
        await updateItem(formValue.id, submitValue);
        message.success("Success");
      } catch (e: any) {
        message.success(e.message || "error!");
      }
    }
    setIsSubmiting(false);
  };
  const validatePositiveNumber = (_: any, value: number) => {
    if (value > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("请输入大于0的数字！"));
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    console.log("onValuesChange", formValue, changedValues, allValues);
    setFormValue(Object.assign({}, formValue, allValues));
  };

  const onReset = () => {
    form.resetFields();
  };

  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  return (
    <Form
      className="w-full"
      {...layout}
      initialValues={formValue}
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
      <Form.Item name="name" label="卡券标题" rules={[{ required: true }]}>
        <Input allowClear placeholder="新人体验卡券,每人只限一次,1000点券" />
      </Form.Item>

      {/* <Form.Item name="title" label="卡券类型" rules={[{ required: true }]}>
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>点卡</Radio>
          <Radio value={2}>天卡</Radio>
        </Radio.Group>
      </Form.Item> */}

      {/* <Form.Item name="salary" label="天卡类别" rules={[{ required: true }]}>
        <Select
          style={{ width: 120 }}
          // onChange={handleChange}
          options={salayOptions}
        />
      </Form.Item> */}
      <Form.Item
        label="卡券充值点数"
        name="cValue"
        rules={[{ required: true }, { validator: validatePositiveNumber }]}
      >
        <Input style={{ width: 120 }} type="number" required />
      </Form.Item>
      <Form.Item
        label="卡券购买金额(元)"
        name="price"
        rules={[{ required: true }]}
      >
        <Input style={{ width: 120 }} type="number" required />
      </Form.Item>
      {/* <Form.Item label="是否允许分销">
        <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
      </Form.Item>
      <Form.Item
        label="返点比例(%)"
        name="cardMoney"
        rules={[{ required: true }]}
      >
        <Input style={{ width: 120 }} required />
      </Form.Item> */}

      <Form.Item
        label="每人仅限一次"
        name="onlyOneTime"
        rules={[{ required: true }]}
      >
        <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
      </Form.Item>
      <Form.Item label="卡券描述" name="desc" rules={[{ required: true }]}>
        <TextArea rows={2} placeholder="卡券描述" allowClear />
      </Form.Item>
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

export default CardsForm;
