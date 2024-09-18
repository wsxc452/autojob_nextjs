import { NextApiRequest, NextApiResponse } from "next";
import { jsonReturn } from "../../common/common";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/db";
import dayjs from "dayjs";

type Params = {};
export async function GET(request: NextRequest, context: { params: Params }) {
  const { userId } = auth().protect();
  const todayStart = dayjs().startOf("day").toDate();
  const todayEnd = dayjs().endOf("day").toDate();

  // // 创建目标日期
  // const targetDate = dayjs.tz("2024-09-09", ChinaZone);

  // 获取前一天（2024-09-08）的最后一秒
  // const previousDayLastSecond = targetDate.subtract(1, "day").endOf("day");
  // const previousDayLastSecond_start = targetDate
  //   .subtract(1, "day")
  //   .startOf("day");
  // // 转换为 UTC ISO 格式
  // const isoFormattedDate = previousDayLastSecond.utc().toISOString();

  // 昨天最后一秒 (UTC ISO 格式): 2024-09-07T16:00:00.000Z 2024-09-08T15:59:59.999Z
  // 前天最后一秒 (UTC ISO 格式): 2024-09-06T16:00:00.000Z 2024-09-07T15:59:59.999Z
  // 后天最后一秒 (UTC ISO 格式): 2024-09-09T16:00:00.000Z 2024-09-10T15:59:59.999Z
  // 今天最后一秒 (UTC ISO 格式): 2024-09-08T16:00:00.000Z 2024-09-09T15:59:59.999Z
  // console.log(
  //   "昨天最后一秒 (UTC ISO 格式):",
  //   previousDayLastSecond_start.utc().toISOString(),
  //   isoFormattedDate,
  // );
  // const previousDayLastSecond2 = targetDate.subtract(2, "day").endOf("day");
  // const previousDayLastSecond2_start = targetDate
  //   .subtract(2, "day")
  //   .startOf("day");
  // // 转换为 UTC ISO 格式
  // const isoFormattedDate2 = previousDayLastSecond2.utc().toISOString();
  // console.log(
  //   "前天最后一秒 (UTC ISO 格式):",
  //   previousDayLastSecond2_start.utc().toISOString(),
  //   isoFormattedDate2,
  // );

  // const previousDayLastSecond3_start = targetDate.add(1, "day").startOf("day");
  // const previousDayLastSecond3_end = targetDate.add(1, "day").endOf("day");

  // console.log(
  //   "后天最后一秒 (UTC ISO 格式):",
  //   previousDayLastSecond3_start.utc().toISOString(),
  //   previousDayLastSecond3_end.utc().toISOString(),
  // );

  // const previousDayLastSecond4_start = targetDate.startOf("day");
  // const previousDayLastSecond4_end = targetDate.endOf("day");

  // console.log(
  //   "今天最后一秒 (UTC ISO 格式):",
  //   previousDayLastSecond4_start.utc().toISOString(),
  //   previousDayLastSecond4_end.utc().toISOString(),
  // );
  // 获取上海今天的起始和结束时间
  // const todayStart = dayjs().tz(shanghaiTimeZone).startOf("day").toISOString(); // 上海时间的开始
  // const todayEnd = dayjs().tz(shanghaiTimeZone).endOf("day").toISOString(); // 上海时间的结束

  // // 将其转换为 UTC 时间
  // const todayStartUTC = dayjs(todayStart).utc().toDate(); // 转换为 UTC Date 对象
  // const todayEndUTC = dayjs(todayEnd).utc().toDate(); // 转换为 UTC Date 对象
  // const todayStartInShanghai = dayjs()
  //   .tz(ChinaZone)
  //   .startOf("day")
  //   .format("YYYY-MM-DD HH:mm:ss");

  // console.log(
  //   "todayStart11111",
  //   todayStart,
  //   todayEnd,
  //   todayStartInShanghai,
  //   dayjs.utc(todayStart).tz(shanghaiTimeZone).format("YYYY-MM-DD HH:mm:ss"),
  //   dayjs.utc(todayEnd).tz(shanghaiTimeZone).format("YYYY-MM-DD HH:mm:ss"),
  // );

  const successRet = await prisma.search.count({
    where: {
      userId,
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
      isCanPost: true,
    },
  });

  const successRet2 = await prisma.search.findMany({
    where: {
      userId,
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
      isCanPost: true,
    },
  });

  const failRet = await prisma.search.count({
    where: {
      userId,
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
      isCanPost: false,
      errDesc: {
        not: {
          contains: "数据已存在",
        },
      },
    },
  });
  const ignoreRet = await prisma.search.count({
    where: {
      userId,
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
      isCanPost: false,
      errDesc: {
        contains: "数据已存在",
      },
    },
  });
  return jsonReturn({
    values: [
      { type: "投递成功", data: successRet },
      { type: "投递过滤", data: failRet },
      { type: "投递忽略", data: ignoreRet },
    ],
    // successRet2,
  });
}
