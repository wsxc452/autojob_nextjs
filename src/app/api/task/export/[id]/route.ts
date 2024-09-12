import prisma from "@/db";
import { FilterCompony, FilterPosition } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GreetingsType } from "@prisma/client";
import { jsonReturn } from "@/app/api/common/common";
type Params = {
  id: string;
};
export async function GET(_request: NextRequest, context: { params: Params }) {
  // 从查询参数中解析分页参数
  const { searchParams } = new URL(_request.url); // 获取 URL 对象
  const { userId } = auth().protect();
  // 查询数据库，获取任务数据
  try {
    const taskInfo = await prisma.tasks.findFirstOrThrow({
      where: {
        id: parseInt(context.params.id),
        userId: userId,
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
        GreetingGroup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const greetingsRet = await prisma.greetings.findMany({
      where: {
        userId,
        status: GreetingsType.ACTICE,
        greetingGroupId: taskInfo.greetingGroupId!,
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
    console.log("greetingsRet", greetingsRet);
    // 返回分页数据和分页信息
    const response = NextResponse.json(
      Object.assign({}, taskInfo, { greetings: greetingsRet }),
    );
    const filename = `data-${encodeURIComponent(taskInfo.searchText!)}.json`;
    response.headers.set(
      "Content-Disposition",
      "attachment; filename=" + filename,
    );

    return response;
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
  const hasMore = body.hasMore;
  const keywords = body.filteredKeywords || [];
  const positions = body.positionKeywords || [];
  const passCompanys = body.passCompanys || [];
  const { userId } = auth().protect();

  // console.log("=====", body);
  delete body.hasMore;
  // delete body.filteredKeywords;
  // delete body.positionKeywords;
  // delete body.passCompanys;
  // delete body.search;
  try {
    if (hasMore) {
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
    } else {
      // 更新任务并添加新的filteredKeywords
      const updatedTask = await prisma.tasks.update({
        where: { id: parseInt(id), userId },
        data: body,
      });
      // 返回更新后的任务数据
      return jsonReturn(updatedTask);
    }
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
