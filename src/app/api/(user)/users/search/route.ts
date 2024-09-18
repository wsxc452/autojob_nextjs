import { NextRequest } from "next/server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "@/app/api/common/common";
import { checkAdminOrThrow } from "@/service/users";
const prisma = new PrismaClient();

type Params = {};
const model = prisma.users;
export async function POST(request: NextRequest, context: { params: Params }) {
  const { userId } = auth().protect();
  try {
    await checkAdminOrThrow(userId);
    const body = await request.json();
    const searchText = body.email || "";
    console.log("body", body);
    if (searchText === "") {
      return jsonReturn({ error: "请输入搜索内容" }, 400);
    }
    const whereCondition = {
      email: {
        contains: searchText,
      },
    };
    const [data, total] = await prisma.$transaction([
      model.findMany({
        select: {
          id: true,
          userId: true,
          email: true,
          userName: true,
          createdAt: true,
          isReferrer: true,
          fullName: true,
          lastName: true,
          isVip: true,
        },
        where: whereCondition,
        orderBy: [
          {
            id: "desc", // 然后按 id 降序排列
          },
        ],
        take: 10,
      }),
      model.count({
        where: whereCondition,
      }),
    ]);
    return jsonReturn({
      data,
      pagination: {
        total,
      },
    });
  } catch (e: any) {
    return jsonReturn({ error: e.message }, 500);
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
