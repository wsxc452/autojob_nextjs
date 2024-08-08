import { NextRequest, NextResponse } from "next/server";
type Params = {};

import { GreetingsType, PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../common/common";
const prisma = new PrismaClient();
const model = prisma.greetings;
export async function GET(request: NextRequest, context: { params: Params }) {
  const { userId } = auth().protect();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  console.log("userId", userId);

  const offset = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    model.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        id: "desc",
      },
      where: {
        userId,
      },
    }),
    model.count({
      where: {
        userId,
      },
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
}

export async function PUT(request: NextRequest, context: { params: {} }) {
  const body = await request.json();
  const { userId } = auth().protect();
  console.log("bodybody", body);
  if (body.id) {
    delete body.id;
  }
  console.log("bodybody2", body);
  const { id, content } = body;
  //body.filteredKeywords.map((item: any) => {return item.keyword},
  try {
    // 使用 Prisma 更新任务数据
    const updatedTask = await model.create({
      data: {
        content,
        userId,
        status: GreetingsType.ACTICE,
      },
    });

    // 返回更新后的任务数据
    return jsonReturn(updatedTask);
  } catch (e: any) {
    // 处理错误情况
    console.error("Unknown Error:", e);
    const errorMessage = e.message || "Internal Server Error";
    return jsonReturn({ error: errorMessage }, 500);
  }
}
