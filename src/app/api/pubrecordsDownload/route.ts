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

    const cardtypeInfo = await prisma.cardTypes.findFirstOrThrow({
      where: {
        id: id,
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
    console.log("allUnRedeemedCards", allUnRedeemedCards);
    // 把记录code写入txt文件，作为流下载，每个code一行

    // // 返回分页数据和分页信息
    // const response = NextResponse.json(allUnRedeemedCards);
    // const filename = `data-${encodeURIComponent("111")}.txt`;
    // response.headers.set(
    //   "Content-Disposition",
    //   "attachment; filename=" + filename,
    // );
    // const data = "123\n345"; // 使用换行符
    // const blob = Buffer.from(data, 'utf-8');

    let data = "";
    allUnRedeemedCards.forEach((item) => {
      data += item.code + "\n";
    });

    let blob = Buffer.from(data, "utf-8");
    const response = new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=${encodeURIComponent(cardtypeInfo.name)}.txt`,
        "Content-Type": "text/plain",
      },
    });
    return response;
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
