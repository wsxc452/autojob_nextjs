import prisma from "@/db";
import { FilterCompony, FilterPosition } from "@/types";
import { NextRequest } from "next/server";
import { jsonReturn } from "../../common/common";
import { auth } from "@clerk/nextjs/server";
import { GreetingsType } from "@prisma/client";
type Params = {
  id: string;
};

export async function GET(_request: NextRequest, context: { params: Params }) {
  // 从查询参数中解析分页参数
  const { searchParams } = new URL(_request.url); // 获取 URL 对象
  const isWithGreeting = searchParams.get("isWithGreeting") || false; // 获取查询参数
  let userIdParam = searchParams.get("userId");
  console.log("userIdParam", userIdParam);
  if (!userIdParam) {
    const { userId } = auth().protect();
    userIdParam = userId;
  }
  // 查询数据库，获取任务数据
  try {
    const [data] = await prisma.$transaction([
      prisma.tasks.findFirstOrThrow({
        where: {
          id: parseInt(context.params.id),
          userId: userIdParam,
        },
        include: {
          positionKeywords: {
            select: {
              id: true,
              keyword: true, // 仅选择需要的字段，例如 keyword
            },
          },
          filteredKeywords: {
            select: {
              id: true,
              keyword: true, // 仅选择需要的字段，例如 keyword
            },
          }, // 包含关联的 filteredKeywords 数据
          passCompanys: {
            select: {
              id: true,
              keyword: true, // 仅选择需要的字段，例如 keyword
            },
          }, //
          search: {
            select: {
              md5: true,
            },
          },
        },
      }),
    ]);
    let greetings: any[] = [];
    if (isWithGreeting) {
      const greetingsRet = await prisma.greetings.findMany({
        where: {
          userId: userIdParam,
          status: GreetingsType.ACTICE,
        },
        select: {
          id: true,
          content: true,
        },
        orderBy: {
          id: "desc",
        },
        skip: 0,
        take: 10,
      });
      greetings = greetingsRet;
    }
    // 返回分页数据和分页信息
    return jsonReturn(
      {
        ...data,
        greetings,
      },
      200,
    );
  } catch (e: any) {
    const errorMessage = e.message || "Internal Server Error";
    return jsonReturn({ error: errorMessage }, 500);
  }
}
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params;
  const body = await request.json();
  const keywords = body.filteredKeywords || [];
  const positions = body.positionKeywords || [];
  const passCompanys = body.passCompanys || [];
  const { userId } = auth().protect();
  try {
    await prisma.filteredCompanyKeywords.deleteMany({
      where: {
        taskId: parseInt(id),
        userId,
      },
    });
    await prisma.filteredPositionKeywords.deleteMany({
      where: {
        taskId: parseInt(id),
        userId,
      },
    });

    await prisma.filterPassCompanys.deleteMany({
      where: {
        taskId: parseInt(id),
        userId,
      },
    });

    // 更新任务并添加新的filteredKeywords

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
    });

    console.log("newBody", newBody);
    const updatedTask = await prisma.tasks.update({
      where: { id: parseInt(id), userId },
      data: newBody,
    });
    // 返回更新后的任务数据
    return jsonReturn(updatedTask);
  } catch (e: any) {
    // 处理错误情况
    // 处理其他未知错误
    console.log("Unknown Error:", e);
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return jsonReturn({ error: errorMessage }, 500);
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
      prisma.filteredPositionKeywords.deleteMany({
        where: {
          taskId: parseInt(id),
        },
      }),
      prisma.filterPassCompanys.deleteMany({
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
    return jsonReturn({ message: "success" });
  } catch (e: any) {
    console.error(e);
    const errorMessage = e.message || "Internal Server Error";
    return jsonReturn({ error: errorMessage }, 500);
  }
}
