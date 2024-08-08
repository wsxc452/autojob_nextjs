import { jsonReturn } from "@/app/api/common/common";
import prisma from "@/db";
import { NextRequest } from "next/server";

type Params = {
  userId: string;
};

export async function GET(_request: NextRequest, context: { params: Params }) {
  // 从查询参数中解析分页参数
  console.log(context.params);
  //   const url = new URL(request.url);
  //   console.log(url);
  // 查询数据库，获取任务数据
  try {
    const [data] = await prisma.$transaction([
      prisma.users.findFirstOrThrow({
        where: {
          userId: context.params.userId,
        },
      }),
    ]);
    console.log(data);
    // 返回分页数据和分页信息
    return jsonReturn(data, 200);
  } catch (e: any) {
    console.error(e);
    const errorMessage = e.message || "Internal Server Error";
    return jsonReturn({ error: errorMessage }, 500);
  }
}
