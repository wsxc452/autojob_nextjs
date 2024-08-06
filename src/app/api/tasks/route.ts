import { NextRequest, NextResponse } from "next/server";
type Params = {};

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../common/common";
const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: Params }) {
  const { userId } = auth().protect();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  console.log("userId", userId);

  const offset = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.tasks.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        id: "desc",
      },
      where: {
        oid: userId,
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

// export async function GET(request: Request) {}

// export async function HEAD(request: Request) {}

// export async function POST(request: Request) {}

// export async function PUT(request: Request) {}

// export async function DELETE(request: Request) {}

// export async function PATCH(request: Request) {}

// // If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
// export async function OPTIONS(request: Request) {}
