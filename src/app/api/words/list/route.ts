import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { jsonReturn } from "../../common/common";
import { auth } from "@clerk/nextjs/server";
import { checkAdminOrThrow } from "@/service/users";
const model = prisma.words;
export async function POST(request: NextRequest) {
  const { userId } = auth().protect();
  const bodyParams = await request.json();
  try {
    await checkAdminOrThrow(userId);
    console.log("====bodyParams", bodyParams);
    //   {
    //     searchForm: {
    //       time_range: [ '2024-09-08T16:00:00.000Z', '2024-09-09T16:00:00.000Z' ]
    //     },
    //     page: 1,
    //     limit: 10
    //   }
    const page = parseInt(bodyParams.page || "1");
    const limit = parseInt(bodyParams.limit || "10");
    const offset = (page - 1) * limit;

    const whereCondition: any = {
      //   userId,
    };

    if (bodyParams.searchForm.time_range) {
      const startTime = bodyParams.searchForm.time_range[0];
      const endTime = bodyParams.searchForm.time_range[1];
      whereCondition.createdAt = {
        gte: new Date(startTime),
        lte: new Date(endTime),
      };
    }

    const [data, total] = await prisma.$transaction([
      model.findMany({
        skip: offset,
        take: limit,
        where: whereCondition,
        orderBy: [
          {
            id: "desc", // 然后按 id 降序排列
          },
        ],
      }),
      model.count({
        where: whereCondition,
      }),
    ]);
    return jsonReturn({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e: any) {
    return jsonReturn({ error: e.message || "口令接口错误" }, 400);
  }
}
