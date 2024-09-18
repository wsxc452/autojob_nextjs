import { jsonReturn } from "@/app/api/common/common";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = auth().protect();
  const { chromePath } = body;
  try {
    // 哈希密码
    const userRet = await prisma.users.update({
      where: { userId },
      data: {
        configJson: JSON.stringify({
          chromePath: chromePath || "",
        }),
      },
    });
    return jsonReturn(userRet);
  } catch (error: any) {
    console.error("config update error:", error);
    return jsonReturn(
      { error: error.toString() || "用户配置信息设置错误" },
      500,
    );
  }
}
