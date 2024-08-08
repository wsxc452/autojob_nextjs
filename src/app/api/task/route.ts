import { NextRequest } from "next/server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../common/common";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  const res = await request.json();
  return Response.json({ res });
}

export async function PUT(request: NextRequest, context: { params: {} }) {
  const body = await request.json();
  const { userId } = auth().protect();
  //body.filteredKeywords.map((item: any) => {return item.keyword},
  try {
    // 使用 Prisma 更新任务数据
    const updatedTask = await prisma.tasks.create({
      data: {
        title: body.title,
        salary: body.salary,
        // position: body.position,
        staffnum: body.staffnum,
        userId,
        filteredKeywords: {
          create: body.filteredKeywords.map((item: any) => {
            return { keyword: item.keyword, userId };
          }),
        },
        positionKeywords: {
          create: body.positionKeywords.map((item: any) => {
            return { keyword: item.keyword, userId };
          }),
        },
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

// export async function GET(request: Request) {}

// export async function HEAD(request: Request) {}

// export async function POST(request: Request) {}

// export async function PUT(request: Request) {}

// export async function DELETE(request: Request) {}

// export async function PATCH(request: Request) {}

// // If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
// export async function OPTIONS(request: Request) {}
