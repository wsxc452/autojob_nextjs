"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Space, DatePicker } from "antd";
import type { RadioChangeEvent, SelectProps } from "antd";
import { createItem, updateItem } from "@/service/words";
import globaStore from "@/app/pc/pcStates/pcStore";
import { useSnapshot } from "valtio";
import message from "@/utils/antdMessage";
import { CardType, CardTypes } from "@prisma/client";
import SearchUserSelect from "./SearchUser";
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const bindOptions: SelectProps["options"] = [
  {
    label: "不绑定",
    value: "false",
  },
  {
    label: "绑定",
    value: "true",
  },
];

const cardOptions: SelectProps["options"] = [
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
    value: "QUARTERLY",
  },
  {
    label: "半年卡",
    value: "HALF_YEARLY",
  },
  {
    label: "年卡",
    value: "YEARLY",
  },
  {
    label: "点卡",
    value: "POINTS",
  },
];

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
    word: "",
    type: CardType.POINTS,
    points: 0, // 点卡点数
    desc: "",
    bindUserId: "",
    bindUserEmail: "",
    time_range: [],
    isBindUser: "false",
    maxCount: 1,
  };
}
const initValue = getInitValue();
const WordsForm: React.FC<FormValues> = ({
  initialValues,
  isLoading = false,
}) => {
  const [form] = Form.useForm();
  const [isCreate, setIsCreate] = useState<boolean>(!initialValues);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<any>(initValue);
  const [selectedCardType, setSelectedCardType] = useState(CardType.POINTS);

  // const [bindUserId, setBindUserId] = useState<string>("");

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

  useEffect(() => {
    if (initialValues) {
      setFormValue(initialValues);
    }
  }, [initialValues]);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setSelectedCardType(value as any);
  };

  const handleBindChange = (value: string) => {
    console.log(`selected ${value}`);
    setFormValue({ ...formValue, isBindUser: value });
  };
  const onFinish = async (values: any) => {
    console.log("Success:", values);
    setIsSubmiting(true);
    const submitValue = {
      ...formValue,
      ...values,
      points:
        selectedCardType === CardType.POINTS ? parseInt(values.points || 0) : 0,
    };
    console.log("submitValue", isCreate, submitValue);
    if (isCreate) {
      try {
        await createItem(submitValue);
        message.success("成功");
        const newValue = getInitValue();
        setFormValue(newValue);
        form.setFieldsValue(newValue);
      } catch (e: any) {
        message.success(e.message || "error!");
      }
    } else {
      try {
        await updateItem(formValue.id, submitValue);
        message.success("成功");
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

  const onSelectCb = (value: JSON | null) => {
    console.log("onSelectCb", value);
    if (value) {
      // setBindUserId((value as any).userId);
      setFormValue({
        ...formValue,
        bindUserId: (value as any).userId,
        bindUserEmail: (value as any).email,
      });
      // form.setFieldValue("bindUserId", (value as any).userId);
    } else {
      setFormValue({ ...formValue, bindUserId: "", bindUserEmail: "" });
      // setBindUserId("");
    }
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
      <Form.Item
        name="word"
        label="口令文字"
        rules={[{ required: true, min: 4, max: 20 }]}
      >
        <Input allowClear placeholder="阿明的福利日卡" />
      </Form.Item>
      <Form.Item name="type" label="卡券类型" rules={[{ required: true }]}>
        <Select
          style={{ width: 120 }}
          onChange={handleChange}
          options={cardOptions}
        />
      </Form.Item>
      <Form.Item
        name="isBindUser"
        label="绑定推广人"
        rules={[{ required: true }]}
      >
        <Select
          value={formValue.isBindUser}
          style={{ width: 120 }}
          onChange={handleBindChange}
          options={bindOptions}
        />
      </Form.Item>
      {formValue.isBindUser === "true" && (
        <Form.Item
          label="绑定推广人"
          name="userId"
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                console.log("value", _, value, formValue.bindUserId);
                if (
                  formValue.bindUserId === "" &&
                  formValue.isBindUser === "true"
                ) {
                  return Promise.reject(new Error("请输入选择要绑定的推广人"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <SearchUserSelect onSelect={onSelectCb} />
        </Form.Item>
      )}
      <Form.Item name="time_range" label="时间范围">
        <RangePicker
          showTime
          allowEmpty={[true, true]}
          // onChange={onRangeChange}
        />
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
          options={cardOptions}
        />
      </Form.Item> */}

      {selectedCardType === "POINTS" && (
        <Form.Item
          label="卡券充值点数"
          name="points"
          rules={[{ required: true }, { validator: validatePositiveNumber }]}
        >
          <Input style={{ width: 120 }} type="number" required />
        </Form.Item>
      )}
      <Form.Item
        label="最多使用次数"
        name="maxCount"
        rules={[{ required: true }]}
      >
        <Input style={{ width: 120 }} min={1} type="number" />
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

      <Form.Item label="口令描述" name="desc" rules={[{ required: true }]}>
        <TextArea
          rows={2}
          placeholder="请输入口令描述,如该口令日卡,仅限10人领取"
          allowClear
        />
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

export default WordsForm;
