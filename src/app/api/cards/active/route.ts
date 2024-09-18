import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../../common/common";
import prisma from "@/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = auth().protect();
  const { code } = body;
  if (!code || code.trim() === "") {
    return jsonReturn({ message: "code格式错误" }, 500);
  }
  try {
    // 是否已经激活过
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        userId: userId,
      },
    });

    // 检测用户是否存在非points类型的卡密核销记录
    const nowTime = new Date();

    if (user?.referrerCode && user?.referrerCode.trim() !== "") {
      return jsonReturn({ message: "已经激活过" }, 500);
    }
    // check code is unique
    const referrer = await prisma.users.findFirst({
      where: {
        referrerCode: code,
      },
    });
    if (referrer) {
      return jsonReturn({ message: "code已经被使用" }, 500);
    }
    const retInfo = await prisma.users.update({
      where: {
        userId: userId,
      },
      data: {
        referrerCode: code,
        referrerTime: nowTime,
        isReferrer: true,
        updatedAt: nowTime,
        isVip: false,
      },
    });
    return jsonReturn({ retInfo });
  } catch (e: any) {
    console.error(e);
    return jsonReturn({ message: e.message || "未找到" }, 500);
  }
}
