import { NextRequest, NextResponse } from "next/server";
type Params = {
  id: number;
};

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../common/common";
import { checkAdminOrThrow } from "@/service/users";
const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: Params }) {
  const { userId } = auth().protect();
  try {
    // 如果非管理员，则要报错
    await checkAdminOrThrow(userId);

    const { searchParams } = new URL(request.url); // 获取 URL 对象
    let idString = searchParams.get("id"); // 获取查询参数

    if (!idString) {
      return jsonReturn({ error: "id 参数错误" }, 400);
    }
    const id = parseInt(idString);

    const allUnRedeemedCardsCount = await prisma.cards.count({
      where: {
        cardTypesId: id,
        isActive: true, // 只选择激活的卡密
      },
    });

    const allUnRedeemedCards = await prisma.cards.findMany({
      select: {
        code: true,
        cardTypesId: true,
        cardTypes: true,
        isActive: true,
      },
      where: {
        cardTypesId: id,
        isActive: true, // 只选择激活的卡密
        isRedeemed: false, // 只选择未核销的卡密
      },
      //   include: {
      //     cardTypes: true, // 包含 CardTypes 的相关信息
      //   },
    });
    // console.log("allUnRedeemedCards", allUnRedeemedCards);
    return jsonReturn({
      cards: allUnRedeemedCards,
      unRedeemed: allUnRedeemedCards.length,
      total: allUnRedeemedCardsCount,
    });
  } catch (error: any) {
    console.log("error", error);
    return jsonReturn({ error: error.message || "卡券记录错误" }, 500);
  }

  //   const result = await prisma.cards.groupBy({
  //     by: ["cardTypesId"],
  //     where: {
  //       isActive: true, // 只选择激活的卡密
  //       isRedeemed: false, // 只选择未核销的卡密
  //       cardEndTime: {
  //         gte: new Date(), // 只选择当前有效的卡密
  //       },
  //     },
  //     _count: {
  //       id: true, // 统计每个卡密类型的数量
  //     },
  //     // include: {
  //     //   cardTypes: true, // 包含 CardTypes 的相关信息
  //     // },
  //   });
}

// const result = await prisma.cards.groupBy({
//     by: ['cardTypesId'],
//     where: {
//       isActive: true, // 只选择激活的卡密
//       isRedeemed: false, // 只选择未核销的卡密
//       cardEndTime: {
//         gte: new Date(), // 只选择当前有效的卡密
//       },
//     },
//     _count: {
//       id: true, // 统计每个卡密类型的数量
//     },
//     include: {
//       cardTypes: true, // 包含 CardTypes 的相关信息
//     },
//   });
