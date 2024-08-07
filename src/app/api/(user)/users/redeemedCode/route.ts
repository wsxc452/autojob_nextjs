import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "@/app/api/common/common";

function isValidateCode(code: string) {
  return /^[0-9A-Za-z]*$/.test(code);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = auth().protect();
  const { code } = body;

  if (!isValidateCode(code)) {
    return jsonReturn({ error: "请输入正确的code" }, 400);
  }
  try {
    const codeInfo = await prisma.cards.findFirst({
      where: {
        code: code,
      },
    });
    if (!codeInfo) {
      return jsonReturn({ error: "该卡片不存在" }, 400);
    }
    if (codeInfo.isRedeemed) {
      return jsonReturn({ error: "该卡片已被兑换" }, 400);
    }

    const balance = codeInfo.value;
    const now = new Date();

    // 更新用户积分和卡片状态
    const updatedUser = await prisma.$transaction([
      prisma.users.update({
        where: { userId: userId },
        data: {
          points: {
            increment: balance,
          },
        },
      }),
      prisma.cards.update({
        where: { code: code },
        data: {
          isRedeemed: true,
          redeemedBy: userId,
          redeemedAt: now,
          updatedAt: now,
        },
      }),
    ]);

    return jsonReturn({ message: "账户增加成功", data: balance });
  } catch (e: any) {
    return jsonReturn({ error: e.message || "账户增加失败" }, 500);
  }
}
