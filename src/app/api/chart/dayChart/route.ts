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
      { type: "投递失败", data: failRet },
      { type: "投递忽略", data: ignoreRet },
    ],
  });
}
