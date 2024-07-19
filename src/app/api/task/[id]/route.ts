import prisma from "@/db";
import { FilterCompony } from "@/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
type Params = {
  id: string;
};

export async function GET(_request: NextRequest, context: { params: Params }) {
  // 从查询参数中解析分页参数
  //   const url = new URL(request.url);
  //   console.log(url);
  // 查询数据库，获取任务数据
  try {
    const [data] = await prisma.$transaction([
      prisma.tasks.findFirstOrThrow({
        where: {
          id: parseInt(context.params.id),
        },
        include: {
          filteredKeywords: {
            select: {
              id: true,
              keyword: true, // 仅选择需要的字段，例如 keyword
            },
          }, // 包含关联的 filteredKeywords 数据
          search: {
            select: {
              md5: true,
            },
          },
        },
      }),
    ]);
    // 返回分页数据和分页信息

    return NextResponse.json({
      data: {
        ...data,
        position: data.position ? data.position.split(",") : [],
      },
      status: 200,
    });
  } catch (e: any) {
    const errorMessage = e.message || "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage, status: 500 },
      { status: 500 },
    );
  }
}
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params;
  const body = await request.json();
  const keywords = body.filteredKeywords || [];

  try {
    await prisma.filteredCompanyKeywords.deleteMany({
      where: {
        taskId: parseInt(id),
      },
    });

    // 更新任务并添加新的filteredKeywords
    const updatedTask = await prisma.tasks.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        salary: body.salary,
        position: body.position,
        staffnum: body.staffnum,
        filteredKeywords: {
          create: keywords.map((item: FilterCompony) => {
            return {
              keyword: item.keyword,
            };
          }),
        },
      },
    });
    // 返回更新后的任务数据
    return NextResponse.json(updatedTask);
  } catch (e: any) {
    // 处理错误情况
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // 处理已知的请求错误
      console.log("Prisma Client Known Request Error:", e.message);
      return NextResponse.json({ error: e.message }, { status: 500 });
    } else if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      // 处理未知的请求错误
      console.log("Prisma Client Unknown Request Error:", e.message);
      return NextResponse.json({ error: e.message }, { status: 500 });
    } else if (e instanceof Prisma.PrismaClientRustPanicError) {
      // 处理 Rust panic 错误
      console.log("Prisma Client Rust Panic Error:", e.message);
      return NextResponse.json({ error: e.message }, { status: 500 });
    } else if (e instanceof Prisma.PrismaClientInitializationError) {
      // 处理客户端初始化错误
      console.log("Prisma Client Initialization Error:", e.message);
      return NextResponse.json({ error: e.message }, { status: 500 });
    } else if (e instanceof Prisma.PrismaClientValidationError) {
      // 处理客户端验证错误
      console.log("Prisma Client Validation Error:", e.message);
      return NextResponse.json({ error: e.message }, { status: 500 });
    } else {
      // 处理其他未知错误
      console.log("Unknown Error:", e);
      const errorMessage =
        e instanceof Error ? e.message : "Internal Server Error";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }
}

// GET, POST, PUT, PATCH, DELETE
export async function DELETE(
  _request: NextRequest,
  context: { params: Params },
) {
  const { id } = context.params;
  // 从查询参数中解析分页参数
  //   const url = new URL(request.url);
  //   console.log(url);
  // 查询数据库，获取任务数据
  try {
    await prisma.$transaction([
      prisma.filteredCompanyKeywords.deleteMany({
        where: {
          taskId: parseInt(id),
        },
      }),
      prisma.tasks.delete({
        where: {
          id: parseInt(id),
        },
      }),
    ]);
    return NextResponse.json({ message: "success" });
  } catch (e: any) {
    const errorMessage = e.message || "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
