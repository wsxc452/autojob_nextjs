"use client";
import ChartTitle from "./ChartTitle";
import { useEffect, useMemo, useState } from "react";
import { BaseUrl } from "@/base/base";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
function TopsChart() {
  const [series, setSeries] = useState([
    {
      name: "失败原因",
      data: [],
    },
  ]);
  const [labels, setLabels] = useState([]);

  const asyncFetch = () => {
    fetch(`${BaseUrl}/api/chart/topsChart`)
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json.data.values);
        const dataArr = (json.data.values || []).filter(
          (item: any) => !item.key.includes("数据已存在"),
        );
        // console.log(dataArr);
        // setData(json.data.values);
        // "values": [
        //   {
        //     "key": "数据已存在",
        //     "value": 1426
        //   },
        //   {
        //     "key": "没有命中职位关键字,不投递",
        //     "value": 287
        //   },
        //   {
        //     "key": "薪资不满足过滤",
        //     "value": 223
        //   },
        //   {
        //     "key": "命中过滤关键字,不投递",
        //     "value": 220
        //   }
        // ]
        setLabels(dataArr.map((item: any) => item.key));
        setSeries([
          {
            name: "Funnel Series",
            data: dataArr.map((item: any) => item.value),
          },
        ]);
      })
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  useEffect(() => {
    asyncFetch();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      // stacked: true,
      toolbar: {
        show: false,
      },
      // zoom: {
      //   enabled: true,
      // },
    },
    xaxis: {
      categories: labels,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        barHeight: "80%",
        isFunnel: true,
      },
    },
    // title: {
    //   text: "Recruitment Funnel",
    //   align: "center",
    // },
    labels: labels,
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
      },
      dropShadow: {
        enabled: true,
      },
    },
    // responsive: [
    //   {
    //     breakpoint: 480,
    //     options: {
    //       legend: {
    //         position: "bottom",
    //       },
    //     },
    //   },
    // ],
    legend: {
      show: false,
    },
    // legend: {
    //   position: "right",
    //   offsetY: 0,
    //   formatter: function (val, opts) {
    //     console.log("val", val, opts);
    //     return val + " - " + opts.w.globals.series[opts.seriesIndex];
    //   },
    // },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className="flex h-[500px] w-full flex-col items-center bg-yellow-100 p-5">
      <ChartTitle title="今日失败汇总" />
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

export default TopsChart;
