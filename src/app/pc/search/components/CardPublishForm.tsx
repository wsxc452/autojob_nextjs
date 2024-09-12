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
import {
  createItem,
  getItem,
  publishCards,
  updateItem,
} from "@/service/cardTypes";
import globaStore from "@/app/pc/pcStates/pcStore";
import { useSnapshot } from "valtio";
import message from "@/utils/antdMessage";
import { CardType, CardTypes } from "@prisma/client";
import { CardPublishFormValuesType } from "@/types";
import { useParams, useRouter } from "next/navigation";
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

function getInitValue() {
  return {
    id: 0,
    name: "新人体验卡券,每人只限一次,1000点券",
    type: CardType.POINTS,
    price: 2,
    cValue: 1000,
    desc: "新人体验卡券,每人只限一次,1000点券",
    rebate: 0,
    onlyOneTime: true,
    isCanDistributor: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
type FormValuesType = {
  id: number;
  name: string;
  pubNum: number;
  desc: string;
};
export default function CardsPublishForm() {
  const { id } = useParams();
  console.log("parsms", id);
  const cardTypeId = id as string;

  const [form] = Form.useForm<FormValuesType>();
  const [formValue, setFormValue] = useState<FormValuesType>({
    id: 0,
    name: "",
    pubNum: 2,
    desc: "",
  });
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const { userInfo } = useSnapshot(globaStore);

  // 获取cartType ID的信息,并展示歘来;
  const getPubInfo = async () => {
    const itemInfo = await getItem(id.toString());
    console.log("itemInfo", itemInfo);
    setFormValue({
      id: itemInfo.data.id,
      name: itemInfo.data.name,
      pubNum: formValue.pubNum,
      desc: itemInfo.data.desc || "",
    });

    form.setFieldsValue({
      id: itemInfo.data.id,
      name: itemInfo.data.name,
      pubNum: formValue.pubNum,
      desc: itemInfo.data.desc || "",
    });
    console.log("itemInfo", itemInfo);
  };

  useEffect(() => {
    getPubInfo();
  }, []);

  const onFinish = async () => {
    const values = form.getFieldsValue();
    console.log("Success:", values);
    setIsSubmiting(true);
    console.log("formValue", form.getFieldsValue());
    try {
      const ret = await publishCards({
        id: parseInt(cardTypeId),
        pubNum: values.pubNum,
      });
      console.log("ret===", ret);
      if (ret.status === 200 && ret.data?.count && ret.data.count > 0) {
        message.success(`${ret.data.count}张卡券发放成功`);
      } else {
        console.error(ret);
        message.error("发券失败 " + ret.data.error);
      }
    } catch (e) {
      console.error(e);
      message.error("发券失败");
    }

    setIsSubmiting(false);
  };
  const validatePositiveNumber = (_: any, value: number) => {
    if (value > 0 && value <= 1000) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("请输入1-1000的数字！"));
  };

  if (!cardTypeId) {
    return <div>参数错误</div>;
  }

  return (
    <Form
      className="w-full"
      {...layout}
      form={form}
      name="control-hooks"
      disabled={isSubmiting}
      initialValues={formValue}
      onFinish={onFinish}
      // style={{ maxWidth: 600 }}
      // onFieldsChange={(e) => onGenderChange(e)}
    >
      <Form.Item name="name" label="卡券标题">
        <Input allowClear readOnly />
      </Form.Item>
      <Form.Item name="desc" label="卡券描述">
        <Input.TextArea rows={2} readOnly />
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
        label="发型数量"
        name="pubNum"
        rules={[{ required: true }, { validator: validatePositiveNumber }]}
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

      <Form.Item {...tailLayout}>
        <Space>
          <Button
            block
            htmlType="submit"
            type="primary"
            loading={isSubmiting}
            disabled={isSubmiting}
          >
            发券
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
