import { jsonReturn } from "@/app/api/common/common";
import prisma from "@/db";
import { NextRequest } from "next/server";

type Params = {
  id: string;
};

export async function GET(_request: NextRequest, context: { params: Params }) {
  // 从查询参数中解析分页参数
  console.log(context.params);
  //   const url = new URL(request.url);
  //   console.log(url);
  // 查询数据库，获取任务数据
  if (!context.params.id) {
    return jsonReturn({ error: "请输入正确的用户id" }, 400);
  }

  console.log("context.params===>", context.params);
  try {
    const retUserInfo = await prisma.users.findFirstOrThrow({
      where: {
        userId: context.params.id,
      },
    });
    console.log("retUserInfo", retUserInfo);
    // 返回分页数据和分页信息
    return jsonReturn(retUserInfo);
  } catch (e: any) {
    console.error(e);
    const errorMessage = e.message || "Internal Server Error";
    return jsonReturn({ error: errorMessage }, 500);
  }
}
