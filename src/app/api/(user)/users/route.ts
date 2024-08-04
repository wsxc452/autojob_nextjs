import { NextRequest } from "next/server";
import { auth, createClerkClient } from "@clerk/nextjs/server";
import { jsonReturn } from "../../common/common";

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
    firstName: user.firstName || "",
    username: user.username || "",
    lastName: user.lastName || "",
    email: user.emailAddresses[0]?.emailAddress || "",
    imageUrl: user.imageUrl || "",
    fullName: `${user.firstName || ""}${user.lastName || ""}`,
    createdAt: user.createdAt,
  }));

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
