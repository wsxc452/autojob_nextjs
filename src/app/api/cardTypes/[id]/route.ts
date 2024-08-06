import prisma from "@/db";
import { FilterCompony } from "@/types";
import { NextRequest } from "next/server";
import { jsonReturn } from "../../common/common";
import { auth } from "@clerk/nextjs/server";
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
      prisma.cardTypes.findFirstOrThrow({
        where: {
          id: parseInt(context.params.id),
        },
      }),
    ]);
    // 返回分页数据和分页信息
    return jsonReturn(data, 200);
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
  const { userId } = auth().protect();
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
        oid: userId,
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
      prisma.tasks.delete({
        where: {
          id: parseInt(id),
        },
      }),
    ]);
    return jsonReturn({ message: "success" });
  } catch (e: any) {
    const errorMessage = e.message || "Internal Server Error";
    return jsonReturn({ error: errorMessage }, 500);
  }
}
