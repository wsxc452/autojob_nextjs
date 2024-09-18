import { jsonReturn } from "@/app/api/common/common";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

type Params = {
  id: string;
};

export async function POST(_request: NextRequest, context: { params: Params }) {
  // 从查询参数中解析分页参数
  const { userId } = auth().protect();
  // const body = await _request.json();

  //   const url = new URL(request.url);
  //   console.log(url);
  // 查询数据库，获取任务数据
  // const userId = body.userId;
  // if (!userId) {
  //   return jsonReturn({ error: "请输入正确的用户userId" }, 400);
  // }

  // console.log("context.params===>", userId);
  try {
    const retUserInfo = await prisma.users.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });
    // console.log("retUserInfo", retUserInfo);
    // 返回分页数据和分页信息
    return jsonReturn(retUserInfo);
  } catch (e: any) {
    // console.error(e);
    const errorMessage = e.message || "Internal Server Error";
    return jsonReturn({ error: errorMessage }, 500);
  }
}
