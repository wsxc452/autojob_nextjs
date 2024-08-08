import { NextRequest } from "next/server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../common/common";
const prisma = new PrismaClient();

type Params = {};

export async function GET(request: NextRequest, context: { params: Params }) {
  const { userId } = auth().protect();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;
  const [data, total] = await prisma.$transaction([
    prisma.cardTypes.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        id: "desc",
      },
    }),
    prisma.tasks.count(),
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

export async function POST(request: Request) {
  const res = await request.json();
  return Response.json({ res });
}

export async function PUT(request: NextRequest, context: { params: {} }) {
  const body = await request.json();
  const { userId } = auth().protect();
  console.log("bodybody", body);
  if (body.id) {
    delete body.id;
  }
  console.log("bodybody2", body);
  const { id, price, cValue, ...rest } = body;
  //body.filteredKeywords.map((item: any) => {return item.keyword},
  try {
    // 使用 Prisma 更新任务数据
    const updatedTask = await prisma.cardTypes.create({
      data: {
        ...rest,
        price: parseInt(price),
        cValue: parseInt(cValue),
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