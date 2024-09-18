"use client";
import {
  Form,
  DatePicker,
  Button,
  TimeRangePickerProps,
  Select,
  SelectProps,
  Row,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(weekday);
dayjs.extend(localeData);
const { RangePicker } = DatePicker;
const layout = {};

const opstOptions: SelectProps["options"] = [
  {
    label: "投递成功",
    value: "true",
  },
  {
    label: "投递失败",
    value: "false",
  },
];

function SearchForm({ searchForm, setSearchForm }: any) {
  const [form] = Form.useForm();

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setSearchForm((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   };

  const onFinish = async function (values: any) {
    console.log("onSumbit", values);
    try {
      setSearchForm((prev: any) => ({
        ...prev,
        time_range: values.time_range,
        isCanPost: values.isCanPost,
      }));
    } catch (e) {
      console.error(e);
    }
  };
  const rangePresets: TimeRangePickerProps["presets"] = [
    {
      label: "今天",
      value: [dayjs().startOf("day"), dayjs().endOf("day")],
    },
    {
      label: "昨天",
      value: [
        dayjs().subtract(1, "day").startOf("day"),
        dayjs().subtract(1, "day").endOf("day"),
      ],
    },
    {
      label: "前天",
      value: [
        dayjs().subtract(2, "day").startOf("day"),
        dayjs().subtract(2, "day").endOf("day"),
      ],
    },
    { label: "最近一周", value: [dayjs().add(-7, "d"), dayjs()] },
  ];

  const onRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[],
  ) => {
    if (dates) {
      console.log("From: ", dates[0], ", to: ", dates[1]);
      console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    } else {
      console.log("Clear");
    }
  };
  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    padding: 24,
  };

  return (
    <div>
      <Form
        className="w-full"
        {...layout}
        // initialValues={{ salary: ["0-0"], job: ["前端"], componySize: ["0-0"] }}
        form={form}
        style={formStyle}
        name="control-hooks"
        onFinish={onFinish}
        layout="inline"
        //   disabled={isLoading || isSubmiting}
        //   // style={{ maxWidth: 600 }}
        //   onValuesChange={(changedValues, allValues) => {
        //     onValuesChange(changedValues, allValues);
        //   }}
        // onFieldsChange={(e) => onGenderChange(e)}
      >
        <Row gutter={24}>
          <Form.Item name="time_range" label="时间范围">
            <RangePicker
              presets={rangePresets}
              // onChange={onRangeChange}
            />
          </Form.Item>
          <Form.Item name="isCanPost" label="投递状态">
            <Select
              style={{ width: 120 }}
              // onChange={handleChange}
              options={opstOptions}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Row>
      </Form>
    </div>
  );
}

export default SearchForm;
