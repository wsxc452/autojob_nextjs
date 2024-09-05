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
  const errGroups = {} as any;

  // // 按周一至周日分组
  records.forEach((record) => {
    // const date = dayjs(record.createdAt);
    // const dayOfWeek = date.format("dddd"); // 获取星期几的英文名称
    // 将英文名称映射到汉字
    let errDesc = record.errDesc; // day() 返回 0-6，分别对应周日到周六

    // 将记录添加到相应的星期数组中
    if (!errDesc || errDesc === "") {
      return;
    }

    if (errDesc.includes("公司薪资范围")) {
      errDesc = "薪资不满足过滤";
    }

    if (!errGroups[errDesc]) {
      errGroups[errDesc] = 0;
    }
    errGroups[errDesc] += 1;
    console.log("errDesc", errDesc);
  });

  // object to array
  const groupedRecords = Object.entries(errGroups).map(([key, value]) => ({
    key,
    value,
  })) as any;
  // // 计算每天的成功、失败、忽略投递次数
  // console.log("groupedRecords", groupedRecords);

  return jsonReturn({
    // groupedRecords,
    values: groupedRecords.sort((a: any, b: any) => b.value - a.value),
  });
}
