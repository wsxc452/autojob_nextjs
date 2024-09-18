"use client";
import ChartTitle from "./ChartTitle";
import { useEffect, useMemo, useState } from "react";
import { BaseUrl } from "@/base/base";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
function PieChartD() {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  const asyncFetch = () => {
    fetch(`${BaseUrl}/api/chart/dayChart`, {
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json.data.values);
        // setData(json.data.values);
        setLabels(json.data.values.map((item: any) => item.type));
        setSeries(json.data.values.map((item: any) => item.data));
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
      type: "pie",
      // stacked: true,
      toolbar: {
        show: false,
      },
      // zoom: {
      //   enabled: true,
      // },
    },
    labels: labels,
    dataLabels: {
      enabled: true,
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
    legend: {
      position: "right",
      offsetY: 0,
      formatter: function (val, opts) {
        console.log("val", val, opts);
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className="flex h-[500px] w-full flex-col items-center bg-yellow-200 p-5">
      <ChartTitle title="今日投递概览" />
      <div className="flex w-full flex-1 flex-col items-center justify-center bg-white text-center">
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          height={400}
          width={500}
        />
      </div>
    </div>
  );
}

export default PieChartD;
