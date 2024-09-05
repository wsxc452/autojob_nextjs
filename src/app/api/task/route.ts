import { NextRequest } from "next/server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../common/common";
import { FilterCompony, FilterPosition } from "@/types";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  const res = await request.json();
  return Response.json({ res });
}

export async function PUT(request: NextRequest, context: { params: {} }) {
  const { userId } = auth().protect();
  const body = await request.json();
  const hasMore = body.hasMore;
  const keywords = body.filteredKeywords || [];
  const positions = body.positionKeywords || [];
  const passCompanys = body.passCompanys || [];

  //body.filteredKeywords.map((item: any) => {return item.keyword},
  console.log("=====", body);
  delete body.hasMore;

  try {
    // 使用 Prisma create任务数据
    if (hasMore) {
      const newBody = Object.assign({}, body, {
        filteredKeywords: {
          create: keywords.map((item: FilterCompony) => {
            return {
              keyword: item.keyword,
              userId,
            };
          }),
        },
        positionKeywords: {
          create: positions.map((item: FilterPosition) => {
            return {
              keyword: item.keyword,
              userId,
            };
          }),
        },
        passCompanys: {
          create: passCompanys.map((item: FilterPosition) => {
            return {
              keyword: item.keyword,
              userId,
            };
          }),
        },
        userId,
      });
      console.log("newBody", newBody);
      const createdTask = await prisma.tasks.create({
        data: newBody,
      });
      // 返回更新后的任务数据
      return jsonReturn(createdTask);
    } else {
      const newBody = Object.assign({}, body, { userId });
      const createdTask = await prisma.tasks.create({
        data: newBody,
      });
      // 返回更新后的任务数据
      return jsonReturn(createdTask);
    }
  } catch (e: any) {
    // 处理错误情况
    console.error("Unknown Error:", e);
    const errorMessage = e.message || "Internal Server Error";
    return jsonReturn({ error: errorMessage }, 500);
  }
}

// export async function GET(request: Request) {}

// export async function HEAD(request: Request) {}

// export async function POST(request: Request) {}

// export async function PUT(request: Request) {}

// export async function DELETE(request: Request) {}

// export async function PATCH(request: Request) {}

// // If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
// export async function OPTIONS(request: Request) {}
