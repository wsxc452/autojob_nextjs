import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../../common/common";
import prisma from "@/db";
import { CardTypes, Cards } from "@prisma/client";

function generateUniqueCode(length: number): string {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

async function generateCards(num: number, cardInfo: CardTypes, userId: string) {
  const cards = [];

  for (let i = 0; i < num; i++) {
    cards.push({
      title: cardInfo.name,
      code: generateUniqueCode(8), // 生成唯一的卡密
      type: cardInfo.type, // 替换为实际的卡密类型
      value: cardInfo.cValue, // 假设存储天数或月份的值为30
      createdBy: userId, // 创建者ID
      isActive: true,
      isRedeemed: false,
      createdAt: new Date(),
    });
  }
  try {
    const ret = await prisma.cards.createMany({
      data: cards,
      skipDuplicates: true,
    });
    console.log("createMany===", ret);
    return ret;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = auth().protect();
  console.log("body", body);
  if (typeof body.pubNum == "undefined" || typeof body.id === "undefined") {
    return jsonReturn({ error: "请输入正确的参数" }, 400);
  }
  const pubNum = parseInt(body.pubNum);
  if (pubNum <= 1) {
    return jsonReturn({ error: "请输入正确的发卡数量" }, 400);
  }
  if (pubNum > 1000) {
    return jsonReturn({ error: "每次发卡数量不能大于1000" }, 400);
  }
  try {
    // 检测是否是管理员, 不是则返回错误
    const userInfo = await prisma.users.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });

    if (userInfo.isSuperUser === false) {
      return jsonReturn({ error: "You are not a super user" }, 500);
    }

    const cardInfo = await prisma.cardTypes.findFirstOrThrow({
      where: {
        id: body.id,
      },
    });
    const ret = await generateCards(body.pubNum, cardInfo, userId);

    return jsonReturn({ count: ret!.count });
  } catch (e: any) {
    console.error(e);
    return jsonReturn({ message: e.message || "发卡失败" }, 500);
  }
}
