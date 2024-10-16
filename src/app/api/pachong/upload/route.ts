import { NextRequest } from "next/server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { FilterCompony, FilterPosition } from "@/types";
const prisma = new PrismaClient();
import { jsonReturn } from "../../common/common";

export async function POST(request: Request) {
  auth().protect();
  try {
    const bodyParams = await request.json();
    // const { userId } = auth().protect();
    // const bodyText = await request.text();
    // 获取请求体
    // 将 URL 编码的字符串解析为对象
    const { taskId, data, pageUrl, userId } = bodyParams;
    // const userId = bodyParams.userId;

    if (!userId || userId === "") {
      return jsonReturn(
        {
          error: "userId不能为空",
          code: "10005",
        },
        500,
      );
    }
    if (!taskId || taskId === "") {
      return jsonReturn(
        {
          error: "taskId不能为空",
          code: "10005",
        },
        500,
      );
    }

    const dataJson = JSON.parse(data);
    const createData = dataJson.map((item: any) => {
      return {
        data: JSON.stringify(item),
        ptaskId: taskId,
        pageUrl,
        userId,
        type: "paChong",
      };
    });

    // console.log(createData);
    const ret = await prisma.paChongData.createMany({
      data: createData,
      // skipDuplicates: true, // 如果需要跳过重复的记录
    });
    // 返回更新后的任务数据
    return jsonReturn({ ret });
  } catch (e: any) {
    console.error(e);
    return jsonReturn({ error: e.toString() }, 500);
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
