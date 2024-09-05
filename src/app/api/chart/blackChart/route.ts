import { jsonReturn } from "../../common/common";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dayjs from "dayjs";
import prisma from "@/db";
type Params = {};
export async function GET(request: NextRequest, context: { params: Params }) {
  const { userId } = auth().protect();

  const startOfWeek = dayjs().startOf("week").add(1, "day").toDate(); // 本周一
  const endOfWeek = dayjs().endOf("week").add(1, "day").toDate(); // 本周日

  const records = await prisma.search.findMany({
    select: {
      id: true,
      isCanPost: true,
      blackInfo: true,
      whiteInfo: true,
      // errDesc: true,
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

  const blackWordsCounter = {} as any;
  const whiteWordsCounter = {} as any;
  // // 按周一至周日分组
  records.forEach((record) => {
    // const date = dayjs(record.createdAt);
    // const dayOfWeek = date.format("dddd"); // 获取星期几的英文名称
    // 将英文名称映射到汉字
    let blackInfo = record.blackInfo; // day() 返回 0-6，分别对应周日到周六

    // 将记录添加到相应的星期数组中
    if (blackInfo && blackInfo !== "") {
      const blackInfoArr = blackInfo.split(",");
      blackInfoArr.forEach((item) => {
        if (!blackWordsCounter[item]) {
          blackWordsCounter[item] = 0;
        }
        blackWordsCounter[item] += 1;
      });
    }

    if (record.whiteInfo && record.whiteInfo !== "") {
      const whiteInfoArr = record.whiteInfo.split(",");
      whiteInfoArr.forEach((item) => {
        if (!whiteWordsCounter[item]) {
          whiteWordsCounter[item] = 0;
        }
        whiteWordsCounter[item] += 1;
      });
    }
  });

  // object to array
  const groupedRecords = Object.entries(blackWordsCounter).map(
    ([key, value]) => ({
      key,
      value,
    }),
  ) as any;

  const groupedRecordsWhite = Object.entries(whiteWordsCounter).map(
    ([key, value]) => ({
      key,
      value,
    }),
  ) as any;
  // // 计算每天的成功、失败、忽略投递次数
  // console.log("groupedRecords", groupedRecords);

  return jsonReturn({
    // groupedRecords,
    values: {
      black: groupedRecords.sort((a: any, b: any) => b.value - a.value),
      white: groupedRecordsWhite.sort((a: any, b: any) => b.value - a.value),
    },
  });
}
