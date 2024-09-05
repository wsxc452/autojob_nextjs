import { NextApiRequest, NextApiResponse } from "next";
import { jsonReturn } from "../../common/common";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dayjs from "dayjs";
import prisma from "@/db";
type Params = {};
export async function GET(request: NextRequest, context: { params: Params }) {
  const { userId } = auth().protect();

  const weekResults = [];

  const startOfWeek = dayjs().startOf("week").add(1, "day").toDate(); // 本周一
  const endOfWeek = dayjs().endOf("week").add(1, "day").toDate(); // 本周日

  const records = await prisma.search.findMany({
    select: {
      id: true,
      isCanPost: true,
      errDesc: true,
      createdAt: true,
    },
    where: {
      createdAt: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
      userId,
    },
  });
  // 定义一个包含汉字的星期数组
  const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
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
  const groupedRecords = daysOfWeek.reduce(
    (acc, day) => {
      acc[day] = []; // 初始化每个星期的数组
      return acc;
    },
    {} as Record<string, typeof records>,
  );

  // // 按周一至周日分组
  records.forEach((record) => {
    const date = dayjs(record.createdAt);
    // const dayOfWeek = date.format("dddd"); // 获取星期几的英文名称
    // 将英文名称映射到汉字
    const chineseDay = daysOfWeek[date.day()]; // day() 返回 0-6，分别对应周日到周六

    // 将记录添加到相应的星期数组中
    if (chineseDay) {
      groupedRecords[chineseDay].push(record);
    }
  });
  const resultGroup = {
    success: {},
    fail: {},
    ignore: {},
  } as any;

  for (const key in groupedRecords) {
    const records = groupedRecords[key];
    let success = 0;
    let fail = 0;
    let ignore = 0;
    records.forEach((record) => {
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
  // // 计算每天的成功、失败、忽略投递次数
  // console.log("groupedRecords", groupedRecords);

  return jsonReturn({
    // groupedRecords,
    values: resultGroup,
  });
}
