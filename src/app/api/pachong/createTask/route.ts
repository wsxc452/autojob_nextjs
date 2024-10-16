import { NextRequest } from "next/server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { FilterCompony, FilterPosition } from "@/types";
const prisma = new PrismaClient();
import { jsonReturn } from "../../common/common";

export async function POST(request: Request) {
  const { userId } = auth().protect();
  try {
    const bodyParams = await request.json();
    // const { userId } = auth().protect();
    // const bodyText = await request.text();
    // 获取请求体
    // 将 URL 编码的字符串解析为对象
    const { url, desc = "" } = bodyParams;
    // const userId = bodyParams.userId;

    if (!url || url === "") {
      return jsonReturn(
        {
          error: "url不能为空",
          code: "10005",
        },
        500,
      );
    }

    const ret = await prisma.pTask.create({
      data: {
        pageUrl: url,
        desc,
        userId,
      },
    });
    return jsonReturn({ ret });
  } catch (e: any) {
    console.error(e);
    return jsonReturn({ error: e.toString() }, 500);
  }
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
