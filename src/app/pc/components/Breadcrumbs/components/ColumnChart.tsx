"use client";
import ChartTitle from "./ChartTitle";
import { BaseUrl } from "@/base/base";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

function ColumnChart() {
  const [data, setData] = useState([]);
  const [series, setSeries] = useState([
    {
      name: "投递成功",
      data: [0],
    },
    {
      name: "投递失败",
      data: [0],
    },
    {
      name: "投递忽略",
      data: [0],
    },
  ]);
  const [categories, setCategories] = useState([
    "周日",
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六",
  ]);
  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    xaxis: {
      type: "category",
      categories: categories,
    },
    legend: {
      position: "right",
      offsetY: 0,
    },
    fill: {
      opacity: 1,
    },
  };

  const asyncFetch = () => {
    fetch(`${BaseUrl}/api/chart/weekChart`)
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json.data.values);
        const data = json.data.values || {};
        setSeries([
          {
            name: "投递成功",
            data: Object.values(data.success || []),
          },
          {
            name: "投递失败",
            data: Object.values(data.fail || []),
          },
          {
            name: "投递忽略",
            data: Object.values(data.ignore || []),
          },
        ]);
        // setCategories(Object.keys(data.success || []) as any);
      })
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  useEffect(() => {
    asyncFetch();
  }, []);

  return (
    <div className="flex h-[500px] w-full flex-col items-center justify-center bg-yellow-200 p-5">
      <ChartTitle title="本周投递概览" />
      <div className="flex w-full flex-1 flex-col items-center justify-center bg-white text-center">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={400}
          width={500}
        />
      </div>
    </div>
  );
}

export default ColumnChart;
