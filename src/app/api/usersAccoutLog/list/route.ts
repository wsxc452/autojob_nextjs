import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { jsonReturn } from "../../common/common";
import { auth } from "@clerk/nextjs/server";
import { sanitizeData } from "@/app/pc/common/util";
const model = prisma.usersAccoutLog;
export async function POST(request: NextRequest) {
  const { userId } = auth().protect();
  const bodyParams = await request.json();
  const { searchForm } = bodyParams;
  // console.log("====bodyParams", bodyParams);
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
    userId,
    // isReferrer: searchForm?.isReferrer || false,
  };

  if (searchForm?.isUser && searchForm.isUser === true) {
    whereCondition.userId = userId;
  }
  if (searchForm?.isReferrer) {
    whereCondition.isReferrer = searchForm?.isReferrer;
  }

  console.log("whereCondition", whereCondition);

  if (bodyParams.searchForm.time_range) {
    const startTime = bodyParams.searchForm.time_range[0];
    const endTime = bodyParams.searchForm.time_range[1];
    whereCondition.createdAt = {
      gte: new Date(startTime),
      lte: new Date(endTime),
    };
  }
  if (bodyParams.searchForm.isCanPost) {
    whereCondition.isCanPost =
      bodyParams.searchForm.isCanPost === "true" ? true : false;
  }
  try {
    const [data, total] = await prisma.$transaction([
      model.findMany({
        skip: offset,
        take: limit,
        where: whereCondition,
        include: {
          User: {
            select: {
              userName: true,
              id: true,
              email: true,
              userId: true,
              createdAt: true,
            },
          },
        },
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
    const sanitizedData = data.map((item) => {
      return {
        ...item,
        User: sanitizeData(item.User, ["email", "userId"])[0],
      };
    });

    return jsonReturn({
      data: sanitizedData,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e: any) {
    return jsonReturn({ error: e.message || "获取数据失败" }, 500);
  }
}
