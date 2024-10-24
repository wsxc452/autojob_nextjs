// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
import { NextRequest, NextResponse } from "next/server";
type Params = {};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: Params }) {
  // 从查询参数中解析分页参数
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  // 计算偏移量
  const offset = (page - 1) * limit;

  // 查询数据库，获取任务数据
  const [data, total] = await prisma.$transaction([
    prisma.tasks.findMany({
      skip: offset,
      take: limit,
    }),
    prisma.tasks.count(),
  ]);

  // 返回分页数据和分页信息
  return NextResponse.json({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
// export async function GET2(request: Request, context: { params: Params }) {
//   const data = await prisma.tasks.findMany({});
//   console.log(request.headers);
//   return NextResponse.json(data);
//   // request.status(200).json({ message: "Hello, world! test", data: data });
// }
export async function POST(request: Request) {
  const res = await request.json();
  return Response.json({ res });
}

export async function PUT(request: NextRequest, context: { params: {} }) {
  console.log("POST request", request);
  const body = await request.json();

  try {
    // 使用 Prisma 更新任务数据
    const updatedTask = await prisma.tasks.create({
      data: {
        title: body.title,
        salary: body.salary,
        position: body.position,
        staffnum: body.staffnum,
        filteredKeywords: {
          create: [
            { keyword: "阿里" },
            { keyword: "腾讯" },
            { keyword: "百度" },
            { keyword: "字节跳动" },
          ],
        },
      },
    });

    // 返回更新后的任务数据
    return NextResponse.json(updatedTask);
  } catch (e: any) {
    // 处理错误情况
    const errorMessage = e.message || "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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
