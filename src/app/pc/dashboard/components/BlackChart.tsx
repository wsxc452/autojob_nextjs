"use client";
import ChartTitle from "./ChartTitle";
import { useEffect, useMemo, useState } from "react";
import { BaseUrl } from "@/base/base";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
function BlackChart() {
  const [series, setSeries] = useState([
    {
      data: [],
    },
  ]);

  const [seriesWhite, setSeriesWhite] = useState([
    {
      data: [],
    },
  ]);
  const [labels, setLabels] = useState([]);

  const asyncFetch = () => {
    fetch(`${BaseUrl}/api/chart/blackChart`, {
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json.data.values);
        const dataArr = json.data.values.black || [];
        setSeries([
          {
            data:
              dataArr.map((item: any) => {
                return {
                  x: item.key,
                  y: item.value,
                };
              }) || [],
          },
        ]);

        const dataArrWhite = json.data.values.white || [];

        setSeriesWhite([
          {
            data:
              dataArrWhite.map((item: any) => {
                return {
                  x: item.key,
                  y: item.value,
                };
              }) || [],
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
      type: "treemap",
      // stacked: true,
      toolbar: {
        show: false,
      },
      // zoom: {
      //   enabled: true,
      // },
    },
    title: {
      text: "职务详情过滤关键字",
      align: "center",
    },
    labels: labels,
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      formatter: function (text: string, op: any) {
        return [text, op.value] as any;
      },
      offsetY: -4,
    },
    legend: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  };
  const optionsWhite: ApexOptions = Object.assign({}, options, {
    title: {
      text: "职务详情命中关键字",
      align: "center",
    },
  });
  return (
    <div className="flex h-[500px] w-full flex-col items-center bg-yellow-100 p-5">
      <ChartTitle title="本周职务描述关键字命中汇总" />
      <div className="flex w-full flex-1 flex-row items-center justify-center gap-5 bg-white pt-5 text-center">
        <ReactApexChart
          options={options}
          series={series}
          type="treemap"
          height={400}
          width={500}
        />
        <ReactApexChart
          options={optionsWhite}
          series={seriesWhite}
          type="treemap"
          height={400}
          width={500}
        />
      </div>
    </div>
  );
}

export default BlackChart;
