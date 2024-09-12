import { NextApiRequest, NextApiResponse } from "next";
import { jsonReturn } from "../../common/common";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dayjs from "dayjs";
import prisma from "@/db";
type Params = {};
export async function GET(request: NextRequest, context: { params: Params }) {
  const { userId } = auth().protect();
  // const startOfWeek = dayjs().startOf("week").add(1, "day").toDate(); // 本周一
  // const endOfWeek = dayjs().endOf("week").add(1, "day").toDate(); // 本周日
  const startOfMonth = dayjs().startOf("month").toDate(); // 本月第一天
  const endOfMonth = dayjs().endOf("month").toDate(); // 本月最后一天
  const records = await prisma.search.findMany({
    select: {
      id: true,
      isCanPost: true,
      errDesc: true,
      createdAt: true,
    },
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      userId: userId,
    },
  });
  // 定义一个包含汉字的星期数组
  const daysInMonth = dayjs().daysInMonth();
  const daysOfMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
    (day) => {
      return {
        key: day,
        data: [],
      } as {
        key: number;
        data: any[];
      };
    },
  );
  // records.forEach((record) => {
  //   const date = dayjs(record.createdAt);
  //   weekResults.push({
  //     dayOfWeek: daysOfWeek[date.day()],
  //     isCanPost: record.isCanPost,
  //     errDesc: record.errDesc,
  //   });
  // });

  // // 按周一至周日分组
  // // 初始化一个包含空数组的分组对象
  // const groupedRecords = daysOfWeek.reduce(
  //   (acc, day) => {
  //     acc[day] = []; // 初始化每个星期的数组
  //     return acc;
  //   },
  //   {} as Record<string, typeof records>,
  // );

  // // 按周一至周日分组
  records.forEach((record) => {
    const date = dayjs(record.createdAt);
    // const dayOfWeek = date.format("dddd"); // 获取星期几的英文名称
    // 将英文名称映射到汉字
    const dayTemp = daysOfMonth[date.date()]; //
    // console.log("record", dayTemp, date.date());
    // 将记录添加到相应的星期数组中
    if (dayTemp) {
      dayTemp.data.push(record);
    }
  });
  const resultGroup = {
    success: {},
    fail: {},
    ignore: {},
  } as any;

  for (const key in daysOfMonth) {
    const records = daysOfMonth[key];
    let success = 0;
    let fail = 0;
    let ignore = 0;
    records.data.forEach((record) => {
      if (record.isCanPost) {
        success++;
      } else {
        if (record.errDesc && record.errDesc.includes("数据已存在")) {
          ignore++;
        } else {
          fail++;
        }
      }
    });
    resultGroup.success[key] = success;
    resultGroup.fail[key] = fail;
    resultGroup.ignore[key] = ignore;
  }
  // // // 计算每天的成功、失败、忽略投递次数
  // // console.log("groupedRecords", groupedRecords);

  return jsonReturn({
    daysOfMonth,
    values: resultGroup,
  });
}
