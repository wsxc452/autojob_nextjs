import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../../common/common";
import prisma from "@/db";

type Params = {};
const model = prisma.users;
export async function GET(request: NextRequest, context: { params: Params }) {
  // 使用 getUserList() 方法获取用户列表
  const { userId } = auth().protect();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  const offset = (page - 1) * limit;
  const [data, total] = await prisma.$transaction([
    model.findMany({
      skip: offset,
      take: limit,
      // where: {
      //   userId,
      // },
      orderBy: [
        {
          id: "desc", // 然后按 id 降序排列
        },
      ],
    }),
    model.count({
      // where: {
      //   userId,
      // },
    }),
  ]);

  return jsonReturn({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
