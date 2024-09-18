import { NextRequest } from "next/server";
import { auth, createClerkClient } from "@clerk/nextjs/server";
import { jsonReturn } from "../../common/common";
import prisma from "@/db";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

type Params = {};
export async function GET(request: NextRequest, context: { params: Params }) {
  // 使用 getUserList() 方法获取用户列表
  const { userId } = auth().protect();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const userListRet = await clerkClient.users.getUserList({
    limit: 10,
    offset: (page - 1) * limit,
    orderBy: "-created_at",
  });

  // 选择特定的属性
  const filteredUsers = userListRet.data.map((user) => ({
    id: user.id,
    userId: user.id,
    firstName: user.firstName || "",
    username: user.username || "",
    lastName: user.lastName || "",
    email: user.emailAddresses[0]?.emailAddress || "",
    imageUrl: user.imageUrl || "",
    fullName: `${user.firstName || ""}${user.lastName || ""}`,
    createdAt: user.createdAt,
    // isAbnormal: false,
    avatar: user.imageUrl || "",
  }));
  // 这里还要同步数据库的信息到列表里面融合
  const userListIds = filteredUsers.map((user) => user.id);

  const findUsers = await prisma.users.findMany({
    where: {
      userId: {
        in: userListIds,
      },
    },
    select: {
      userId: true,
      email: true,
      isAbnormal: true,
      isVip: true,
      referrerCode: true,
      referrerTime: true,
      referrerVipTime: true,
      // 添加其他您想要选择的字段
    },
  });

  for (const user of filteredUsers) {
    const findUser = findUsers.find((u) => u.userId === user.id);
    if (findUser) {
      // user.isAbnormal = findUser.isAbnormal;
      Object.assign(user, findUser);
    }
  }

  const total = userListRet.totalCount;
  return jsonReturn({
    data: filteredUsers,
    pagination: {
      total: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
