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
  const { id, price, cValue, type, ...rest } = body;
  //body.filteredKeywords.map((item: any) => {return item.keyword},
  try {
    // 使用 Prisma 更新任务数据
    // id               Int      @id @default(autoincrement())
    // name             String   @db.VarChar(50) // 卡密类型名称
    // type             CardType @default(POINTS)
    // price            Float    @default(0) // 卡密价格，默认为 0
    // cValue           Int      @default(0) // 卡密价值，默认为 0
    // desc             String?  @db.VarChar(100) // 卡密类型描述
    // rebate           Float?   @default(0) // 返点比例，默认为 null
    // onlyOneTime      Boolean  @default(false) // 是否只能购买一次，默认为 false
    // isCanDistributor Boolean  @default(false) // 是否可以分销，默认为 false
    // createdAt        DateTime @default(now()) // 创建时间
    // updatedAt        DateTime @updatedAt // 更新时间
    // Cards            Cards[]
    // userId           String?  @db.VarChar(64) // 用户 ID
    const updatedTask = await prisma.cardTypes.create({
      data: {
        ...rest,
        price: parseInt(price),
        cValue: type === "POINTS" ? parseInt(cValue) : 0,
        type,
        userId,
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
