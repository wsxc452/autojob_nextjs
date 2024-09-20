/* eslint-disable react/display-name */
"use client";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Form, Input, Select } from "antd";
import { TaskItem, TaskItemForm } from "@/types";
import { useGreetingGroup } from "@/hooks/useGreetingGroup";
import { getInitValue } from "../../task/edit/[[...id]]/initValue";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
// https://www.zhipin.com/web/geek/job?city=101020100&experience=108,105,106,104&degree=208,202&scale=303,304&salary=404

//   initialValues,
//   isLoading = false,
const TaskForm = forwardRef(
  ({ initialValues, isLoading = false, onFormFinish }: any, ref) => {
    const [form] = Form.useForm<TaskItemForm>();
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
    const [formValue, setFormValue] = useState<TaskItemForm>(
      initialValues || getInitValue(),
    );
    const [groupOptions, setGroupOptions] = useState<
      {
        label: string;
        value: number;
      }[]
    >([]);

    const { data: groupData, isLoading: groupIsLoading } = useGreetingGroup(
      1,
      10,
    );
    useEffect(() => {
      if (!groupIsLoading) {
        const options = groupData?.data.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        setGroupOptions(options);
      }
    }, [groupData, groupIsLoading]);

    useEffect(() => {
      setFormValue(initialValues);
      form.setFieldsValue(initialValues);
    }, [initialValues]);

    useImperativeHandle(ref, () => ({
      // 可以暴露的方法或属性
      submit: () => {
        console.log("base submit");
        return new Promise((resolve, reject) => {
          form.submit();
          form
            .validateFields()
            .then((values) => {
              console.log("useImperativeHandle values", values);
              // onFormFinish("baseForm", values);
              resolve(values);
            })
            .catch((e) => {
              console.error(e);
              reject(e);
            });
        });
      },
      resetFields: () => {
        form.resetFields();
      },
    }));

    const onFinish = async (values: any) => {
      setIsSubmiting(true);
      console.log("Received values of form111: ", values);
      setIsSubmiting(false);
    };

    // const onValuesChange = (changedValues: any, allValues: any) => {
    //   console.log("onValuesChange", formValue, changedValues, allValues);
    //   setFormValue(Object.assign({}, formValue, allValues));
    // };

    const validateMaxCount = (_: any, value: number) => {
      if (value > 0 && value <= 100) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("1-100之间"));
    };

    return (
      <>
        {/* <Form.Item name="title" label="任务标题" rules={[{ required: true }]}>
        <Input />
      </Form.Item> */}
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
          // onValuesChange={(changedValues, allValues) => {
          //   onValuesChange(changedValues, allValues);
          // }}
          // onFieldsChange={(e) => onGenderChange(e)}
        >
          <Form.Item
            name="searchText"
            label="搜索职位名称"
            rules={[
              { required: true },
              { min: 2, message: "最少2个字符" },
              { max: 200, message: "最多200个字符" },
            ]}
          >
            <Input placeholder="请输入搜索职位关键字,多个用,分割" />
          </Form.Item>
          <Form.Item
            name="greetingGroupId"
            label="打招呼分组"
            rules={[{ required: true }]}
          >
            <Select
              allowClear
              style={{ width: 120, fontSize: "12px" }}
              // onChange={handleChange}
              options={groupOptions}
            />
          </Form.Item>
          <Form.Item
            name="maxCount"
            label="最大投递数"
            rules={[{ required: true }, { validator: validateMaxCount }]}
          >
            <Input type="number" style={{ width: "120px" }} />
          </Form.Item>
        </Form>
      </>
    );
  },
);

// const TaskForm2: React.FC<FormValues> = ({
//   initialValues,
//   isLoading = false,
// }) => {

// };

export default TaskForm;
