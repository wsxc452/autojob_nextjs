import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../../common/common";
import prisma from "@/db";
import { CardType } from "@prisma/client";

export async function GET(request: Request) {
  const { userId } = auth().protect();
  try {
    // 检测用户是否存在非points类型的卡密核销记录
    const retInfo = await prisma.cards.findFirstOrThrow({
      where: {
        redeemedBy: userId,
        price: {
          gt: 0,
        },
        type: {
          not: CardType.POINTS,
        },
      },
    });

    return jsonReturn({ retInfo });
  } catch (e: any) {
    // console.error(e);
    return jsonReturn({ message: e.message || "未找到" }, 500);
  }
}
