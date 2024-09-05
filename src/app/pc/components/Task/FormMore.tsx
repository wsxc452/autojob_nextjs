"use client";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  App,
  Tag,
  Switch,
  Col,
  Row,
} from "antd";
import type { SelectProps } from "antd";
import { TaskItem, TaskItemForm } from "@/types";
import { createTask, updateTask } from "@/service/task";
import message from "@/utils/antdMessage";
import { KeyWordsMap } from "@/app/api/search/route";
import { getCity } from "@/service/city";
import { on } from "events";
import { getInitValue } from "../../task/edit/[[...id]]/initValue";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const salaryOptions = [
  {
    label: "不限",
    value: "0",
  },
  {
    label: "3K以下",
    value: "402",
  },
  {
    label: "3-5K",
    value: "403",
  },
  {
    label: "5-10K",
    value: "404",
  },
  {
    label: "10-20K",
    value: "405",
  },
  {
    label: "20-50K",
    value: "406",
  },
  {
    label: "50K以上",
    value: "407",
  },
];

{
  /* <ul>
  <li ka="sel-scale-0" class="">
    {" "}
    不限<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-scale-301" class="">
    {" "}
    0-20人<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-scale-302" class="active">
    {" "}
    20-99人<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-scale-303" class="active">
    {" "}
    100-499人<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-scale-304" class="active">
    {" "}
    500-999人<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-scale-305" class="">
    {" "}
    1000-9999人<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-scale-306" class="">
    {" "}
    10000人以上<i class="ui-icon-check"></i>
  </li>
</ul>; */
}
const scaleOptions = [
  {
    label: "不限",
    value: "0",
  },
  {
    label: "0-20人",
    value: "301",
  },
  {
    label: "20-99人",
    value: "302",
  },
  {
    label: "100-499人",
    value: "303",
  },
  {
    label: "500-999人",
    value: "304",
  },
  {
    label: "1000-9999人",
    value: "305",
  },
  {
    label: "10000人以上",
    value: "306",
  },
];

{
  /* <ul>
  <li ka="sel-degree-0" class="">
    {" "}
    不限<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-degree-209" class="">
    {" "}
    初中及以下<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-degree-208" class="">
    {" "}
    中专/中技<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-degree-206" class="">
    {" "}
    高中<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-degree-202" class="">
    {" "}
    大专<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-degree-203" class="">
    {" "}
    本科<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-degree-204" class="">
    {" "}
    硕士<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-degree-205" class="">
    {" "}
    博士<i class="ui-icon-check"></i>
  </li>
</ul>; */
}
{
  /* <ul>
  <li ka="sel-exp-0" class="">
    {" "}
    不限<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-exp-108" class="active">
    {" "}
    在校生<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-exp-102" class="">
    {" "}
    应届生<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-exp-101" class="">
    {" "}
    经验不限<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-exp-103" class="">
    {" "}
    1年以内<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-exp-104" class="active">
    {" "}
    1-3年<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-exp-105" class="active">
    {" "}
    3-5年<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-exp-106" class="active">
    {" "}
    5-10年<i class="ui-icon-check"></i>
  </li>
  <li ka="sel-exp-107" class="">
    {" "}
    10年以上<i class="ui-icon-check"></i>
  </li>
</ul>; */
}
const experienceOptions = [
  {
    label: "不限",
    value: "0",
  },
  {
    label: "在校生",
    value: "108",
  },
  {
    label: "应届生",
    value: "102",
  },
  {
    label: "经验不限",
    value: "101",
  },
  {
    label: "1年以内",
    value: "103",
  },
  {
    label: "1-3年",
    value: "104",
  },
  {
    label: "3-5年",
    value: "105",
  },
  {
    label: "5-10年",
    value: "106",
  },
  {
    label: "10年以上",
    value: "107",
  },
];
const degreeOptions = [
  {
    label: "不限",
    value: "0",
  },
  {
    label: "初中及以下",
    value: "209",
  },
  {
    label: "中专/中技",
    value: "208",
  },
  {
    label: "高中",
    value: "206",
  },
  {
    label: "大专",
    value: "202",
  },
  {
    label: "本科",
    value: "203",
  },
  {
    label: "硕士",
    value: "204",
  },
  {
    label: "博士",
    value: "205",
  },
];
// https://www.zhipin.com/web/geek/job?city=101020100&experience=108,105,106,104&degree=208,202&scale=303,304&salary=404
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

type FormValues = {
  initialValues?: TaskItemForm;
  isLoading?: boolean;
};
// const TaskFormMore = forwardRef((props: any, ref) => {
//   useImperativeHandle(ref, () => ({
//     // 可以暴露的方法或属性
//     submit: () => {
//       console.log("more submit");
//     },
//   }));

//   return <FormMore {...props} />;
// });

// const TaskFormForm: React.FC<FormValues> = ({
const TaskFormForm = forwardRef(
  ({ initialValues, isLoading = false }: any, ref) => {
    const [form] = Form.useForm<TaskItemForm>();
    const [isCreate, setIsCreate] = useState<boolean>(!initialValues);
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
    const [formValue, setFormValue] = useState<any>(
      initialValues || getInitValue(),
    );
    const [cityNameShow, setCityNameShow] = useState<string>("");
    const [cityOptions, setCityOptions] = useState<SelectProps["options"]>([]);
    const [inputPositionValue, setInputPositionValue] = useState("");
    const [inputPassValue, setInputPassValue] = useState("");
    const [inputValue, setInputValue] = useState("");
    useEffect(() => {
      try {
        getCity().then((data) => {
          console.log("city-data", data);
          // options.push(...data);
          setCityOptions(
            data.data.map((item: any) => ({
              value: item.code,
              label: item.name,
              pinyin: item.pinyin,
              keyword: item.name + "" + item.pinyin,
            })),
          );
        });
      } catch (err) {
        console.log(err);
      }
    }, []);

    useEffect(() => {
      if (initialValues) {
        setCityNameShow(initialValues.cityName);
        setFormValue(initialValues);
        form.setFieldsValue(initialValues);
      }
      setIsCreate(!initialValues);
    }, [initialValues, form]);

    useImperativeHandle(ref, () => ({
      // 可以暴露的方法或属性
      submit: () => {
        console.log("more submit");
        // onFinish(form.getFieldsValue());
        return new Promise((resolve, reject) => {
          form.submit();
          form
            .validateFields()
            .then((values) => {
              const moreValue = Object.assign({}, formValue, values, {
                cityName: cityNameShow,
              });
              delete moreValue.greetingGroupId;
              delete moreValue.maxCount;
              delete moreValue.searchText;
              console.log("useImperativeHandle moreForm values", values);
              // onFormFinish("baseForm", values);
              resolve(moreValue);
            })
            .catch((e) => {
              console.error(e);
              reject(e);
            });
        });
      },
      resetFields: () => {
        console.log("resetFields");
        form.resetFields();
        setFormValue(getInitValue());
        setInputPassValue("");
        setInputPositionValue("");
        setInputValue("");
      },
    }));
    const onFinish = async (values: any) => {
      setIsSubmiting(true);
      console.log("Received values of form222: ", values);
      // const submitValue = Object.assign({}, values, {
      //   salary: values.salary.minMoney + "-" + values.salary.maxMoney + "K",
      //   filteredKeywords: formValue.filteredKeywords,
      //   positionKeywords: formValue.positionKeywords,
      //   passCompanys: formValue.passCompanys,
      //   degreeValue: values.degreeValue.join(","),
      //   scaleValue: values.scaleValue.join(","),
      //   experienceValue: values.experienceValue.join(","),
      //   maxCount: parseInt(values.maxCount),
      //   cityName: cityNameShow,
      //   cityCode: formValue.cityCode,
      // });
      // // const submitValue = {
      // //   title: values.title,
      // //   cityCode: values.cityCode,
      // //   searchText: values.searchText,
      // //   cityName: cityNameShow,
      // // };
      // console.log("111", submitValue);
      // if (formValue.positionKeywords.length === 0) {
      //   message.error("职位关键字最少要添加一个!");
      //   setIsSubmiting(false);
      //   return;
      // }
      // if (isCreate) {
      //   try {
      //     await createTask(submitValue);
      //     message.success("Success");
      //     const newValue = getInitValue();
      //     // TODO
      //     setFormValue(newValue);
      //     form.setFieldsValue(newValue);
      //     resetForm();
      //   } catch (e: any) {
      //     message.success(e.message || "error!");
      //   }
      // } else {
      //   try {
      //     await updateTask(formValue.id, submitValue);
      //     message.success("Success");
      //   } catch (e: any) {
      //     message.success(e.message || "error!");
      //   }
      // }
      setIsSubmiting(false);
    };

    // const onValuesChange = (changedValues: any, allValues: any) => {
    //   console.log("onValuesChange", formValue, changedValues, allValues);
    //   setFormValue(Object.assign({}, formValue, allValues));
    // };

    const onRemoveFilter = (id: number) => {
      console.log(id);
      setFormValue(
        Object.assign({}, formValue, {
          filteredKeywords: formValue.filteredKeywords.filter(
            (item: KeyWordsMap) => item.id !== id,
          ),
        }),
      );
    };
    const onRemovePositon = (id: number) => {
      console.log(id);
      setFormValue(
        Object.assign({}, formValue, {
          positionKeywords: formValue.positionKeywords.filter(
            (item: KeyWordsMap) => item.id !== id,
          ),
        }),
      );
    };
    const onRemovePass = (id: number) => {
      console.log(id);
      setFormValue(
        Object.assign({}, formValue, {
          passCompanys: formValue.passCompanys.filter(
            (item: KeyWordsMap) => item.id !== id,
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
        filterArr = filterArr.filter((itemFlter) => {
          return (
            formValue.filteredKeywords.findIndex(
              (item: KeyWordsMap) => item.keyword === itemFlter,
            ) === -1 && itemFlter.trim() !== ""
          );
        });
      } else {
        // 如果是一个一个输入的,则提示是否有重复
        filterArr[0] = inpuValueTemp;
        if (
          formValue.filteredKeywords.findIndex(
            (item: KeyWordsMap) => item.keyword === inpuValueTemp,
          ) !== -1
        ) {
          message.info("过滤的公司已经存在");
          return;
        }
      }
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
    const validateMaxCount = (_: any, value: number) => {
      if (value > 0 && value <= 100) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("1-100之间"));
    };

    const validateMaxMoney = (_: any, value: number) => {
      const minMoney = form.getFieldValue(["salary", "minMoney"]);
      console.log("validateMaxMoney", value, minMoney);
      if (value && minMoney && value <= minMoney) {
        return Promise.reject(new Error("最大薪资必须大于最小薪资"));
      }
      return Promise.resolve();
    };

    const addFilterPosition = () => {
      // check if the value is already in the list
      // console.log("formValue", formValue);
      if (inputPositionValue.trim() === "") {
        message.info("请输入要职位关键字");
        return;
      }
      let positionArr = [];
      // 如果字符串中存在,分隔;说明是批量导入;
      const inputPositionValueTemp = inputPositionValue.replaceAll("，", ",");
      if (inputPositionValueTemp.indexOf(",") !== -1) {
        positionArr = inputPositionValueTemp.split(",");
        // 过滤掉已经存在的
        //formValue.positionKeywords
        positionArr = positionArr.filter((itemFlter) => {
          return (
            formValue.positionKeywords.findIndex(
              (item: KeyWordsMap) => item.keyword === itemFlter,
            ) === -1 && itemFlter.trim() !== ""
          );
        });
      } else {
        // 如果是一个一个输入的,则提示是否有重复
        positionArr[0] = inputPositionValueTemp;
        if (
          formValue.positionKeywords.findIndex(
            (item: KeyWordsMap) => item.keyword === inputPositionValueTemp,
          ) !== -1
        ) {
          message.info("职位关键字已经存在!");
          return;
        }
      }
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

    const addFilterPassCompany = () => {
      // check if the value is already in the list
      console.log("formValue", formValue);
      if (inputPassValue.trim() === "") {
        message.info("请输入要过滤公司的关键字");
        return;
      }
      let passArr = [];
      // 如果字符串中存在,分隔;说明是批量导入;
      const inputPassValueTemp = inputPassValue.replaceAll("，", ",");
      if (inputPassValueTemp.indexOf(",") !== -1) {
        passArr = inputPassValueTemp.split(",");
        passArr = passArr.filter((itemFlter) => {
          return (
            formValue.passCompanys.findIndex(
              (item: KeyWordsMap) => item.keyword === itemFlter,
            ) === -1 && itemFlter.trim() !== ""
          );
        });
      } else {
        // 如果是一个一个输入的,则提示是否有重复
        passArr[0] = inputPassValueTemp;
        if (
          formValue.passCompanys.findIndex(
            (item: KeyWordsMap) => item.keyword === inputPassValueTemp,
          ) !== -1
        ) {
          message.info("公司关键字已经存在");
          return;
        }
      }
      const newPasss = passArr.map((item) => {
        return {
          id: Date.now() + item,
          keyword: item,
        };
      }) as any;

      setFormValue(
        Object.assign({}, formValue, {
          passCompanys: formValue.passCompanys.concat(newPasss),
        }),
      );
      setInputPassValue("");
    };

    const handleInputChange = (e: any) => {
      setInputValue(e.target.value);
    };

    const handleInputPositionChange = (e: any) => {
      setInputPositionValue(e.target.value);
    };

    const handleInputPassChange = (e: any) => {
      setInputPassValue(e.target.value);
    };

    const handleChange = (newValue: string, option: any) => {
      console.log("handleChange", newValue, option);
      if (!option) {
        form.setFieldsValue({ cityCode: "" });
        setFormValue(
          Object.assign({}, formValue, {
            cityCode: "",
          }),
        );
        setCityNameShow("");
        return;
      }
      form.setFieldsValue({ cityCode: newValue });
      setFormValue(
        Object.assign({}, formValue, {
          cityCode: newValue,
        }),
      );
      setCityNameShow(option.label);
    };

    const handleSalaryChange = (newValue: string, option: any) => {
      console.log("handleSalaryChange", newValue, option);
      if (!newValue || newValue === "") {
        form.setFieldsValue({ salaryValue: "0" });
        setFormValue(
          Object.assign({}, formValue, {
            salaryValue: "0",
          }),
        );
      }
    };

    const handleSelectChange = (
      newValue: string[],
      option: any,
      key: string,
    ) => {
      console.log("handleSelectChange", newValue, option, key);
      const isZero = newValue.findIndex((item) => item === "0");
      console.log("isZero", isZero);
      if (isZero === 0 && newValue.length > 1) {
        newValue = newValue.slice(1);
      } else if (isZero > 0 && newValue.length > 1) {
        newValue = ["0"];
      } else if (newValue.length === 0) {
        newValue = ["0"];
      }
      // if (isZero !== -1 && newValue.length > 1) {
      //   newValue = ["0"];
      // }
      // if (!option) {
      //   form.setFieldsValue({ cityCode: "" });
      //   setFormValue(
      //     Object.assign({}, formValue, {
      //       cityCode: "",
      //     }),
      //   );
      //   setCityNameShow("");
      //   return;
      // }
      form.setFieldsValue({ [key]: newValue });
      setFormValue(
        Object.assign({}, formValue, {
          [key]: newValue,
        }),
      );
      // setCityNameShow(option.label);
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
          name="form-more"
          onFinish={onFinish}
          disabled={isLoading || isSubmiting}
          // style={{ maxWidth: 600 }}
          // onValuesChange={(changedValues, allValues) => {
          //   onValuesChange(changedValues, allValues);
          // }}
          // onFieldsChange={(e) => onGenderChange(e)}
        >
          <Form.Item label="投递城市" rules={[{ required: false }]}>
            <Select
              showSearch
              allowClear
              style={{ width: "30%" }}
              placeholder="请输入城市名,不填写会使用默认城市"
              onChange={handleChange}
              value={formValue?.cityCode || ""}
              options={cityOptions}
              filterOption={(input, option: any) =>
                (option?.keyword ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />

            <span> 城市编码:{formValue?.cityCode || ""}</span>
            <span className="px-5">tips:不填写会使用默认城市</span>
          </Form.Item>

          <Form.Item label="条件设置">
            <Row>
              <Col span={8}>
                <Form.Item name="experienceValue" label="工作经验">
                  <Select
                    allowClear
                    mode="multiple"
                    placeholder="请选择工作经验"
                    onChange={(newValue: string[], option: any) =>
                      handleSelectChange(newValue, option, "experienceValue")
                    }
                    options={experienceOptions}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="salaryValue" label="薪资待遇">
                  <Select
                    allowClear
                    placeholder="请选择薪资待遇"
                    onChange={handleSalaryChange}
                    options={salaryOptions}
                  />
                </Form.Item>
              </Col>
              <Col span={8}></Col>
              <Col span={8}>
                <Form.Item name="degreeValue" label="学历要求">
                  <Select
                    allowClear
                    mode="multiple"
                    placeholder="请选择薪范围"
                    onChange={(newValue: string[], option: any) =>
                      handleSelectChange(newValue, option, "degreeValue")
                    }
                    options={degreeOptions}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="scaleValue" label="公司规模">
                  <Select
                    allowClear
                    mode="multiple"
                    placeholder="请选择公司规模"
                    onChange={(newValue: string[], option: any) =>
                      handleSelectChange(newValue, option, "scaleValue")
                    }
                    options={scaleOptions}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="过滤设置">
            <Row>
              <Col span={8}>
                <Form.Item name="headhunterCheck" label="过滤猎头">
                  <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    defaultChecked
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="bossOnlineCheck" label="过滤非在线HR">
                  <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    defaultChecked
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="activeCheck" label="过滤非活跃HR">
                  <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    defaultChecked
                  />
                </Form.Item>
              </Col>
            </Row>
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

          <Form.Item label="过滤公司名称关键字">
            <div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    value={inputPassValue}
                    onChange={handleInputPassChange}
                    placeholder="请输入需要屏蔽的公司名,如:阿里巴巴,腾讯,百度。多个用关键词可以用,分隔;"
                    allowClear={true}
                  />
                </div>
                <div className="col-span-1 flex items-center gap-2">
                  <Button
                    type="primary"
                    size="small"
                    onClick={addFilterPassCompany}
                  >
                    新增过滤公司关键字
                  </Button>
                </div>
              </div>
              <div className="flex w-full flex-row flex-wrap gap-2 py-5">
                {(formValue.passCompanys || []).length === 0 && (
                  <span className="font-bold">暂未设置</span>
                )}
                {(formValue.passCompanys || []).map((compony: KeyWordsMap) => (
                  <Tag
                    key={compony.id}
                    closable
                    onClose={() => {
                      onRemovePass(compony.id);
                    }}
                  >
                    {compony.keyword}
                  </Tag>
                ))}
              </div>
            </div>
          </Form.Item>

          <Form.Item label="匹配招聘描述关键字">
            <div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    value={inputPositionValue}
                    placeholder="请输入职位关键字,如销售,产品,本科。多个用关键词可以用,分隔; (用来跟公司职位描述去匹配)"
                    onChange={handleInputPositionChange}
                    allowClear={true}
                  />
                </div>
                <div className="col-span-1 flex items-center gap-2">
                  <Button
                    type="primary"
                    size="small"
                    onClick={addFilterPosition}
                  >
                    新增职位关键字
                  </Button>
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <p>
                    (建议填写,譬如找技术岗位,则填写技术的关键字Java,或者Js,如果是销售,则填写销售...)
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-row flex-wrap gap-2 py-5">
                {(formValue.positionKeywords || []).length === 0 && (
                  <span className="font-bold">暂未设置</span>
                )}
                {(formValue.positionKeywords || []).map(
                  (position: KeyWordsMap) => (
                    <Tag
                      key={position.id}
                      closable
                      onClose={() => {
                        onRemovePositon(position.id);
                      }}
                    >
                      {position.keyword}
                    </Tag>
                  ),
                )}
              </div>
            </div>
          </Form.Item>

          <Form.Item label="过滤职位详情关键字">
            <div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="请输入需要过滤的职位关键字,如全日制,硕士,大小周;"
                    allowClear={true}
                  />
                </div>
                <div className="col-span-1 flex items-center gap-2">
                  <Button type="primary" size="small" onClick={addFilter}>
                    新增过滤职位关键字
                  </Button>
                </div>
              </div>
              <div className="flex w-full flex-row flex-wrap gap-2 py-5">
                {(formValue.filteredKeywords || []).length === 0 && (
                  <span className="font-bold">暂未设置</span>
                )}
                {(formValue.filteredKeywords || []).map(
                  (compony: KeyWordsMap) => (
                    <Tag
                      key={compony.id}
                      closable
                      onClose={() => {
                        onRemoveFilter(compony.id);
                      }}
                    >
                      {compony.keyword}
                    </Tag>
                  ),
                )}
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
        </Form>
      </>
    );
  },
);

export default TaskFormForm;
