import prisma from "@/db";
import { PrismaClient, Users } from "@prisma/client";
import { hash } from "crypto";
import { jsonReturn } from "../../common/common";

export async function GET(request: Request) {
  return jsonReturn({ data: "syncuser" });
}
export async function POST(request: Request) {
  const body = await request.json();
  const ret = await syncUserToBackup({
    userId: body.userId,
    email: body.email,
    username: body.username,
    // password: body.password,
    // avatar: body.avatar,
  });
  return jsonReturn({ data: ret });
}
interface User {
  userId: string;
  email: string;
  username?: string; // username 可能为空
  password: string; // 原始密码
  avatar?: string; // 头像 URL
}

// 用户注册时,要同步用户到 UserBackup 表
async function syncUserToBackup(user: Partial<Users>) {
  try {
    // 哈希密码
    // const passwordHash = await hash(user.password, "sha256");

    // 同步用户到 UserBackup 表
    const backupUser = await prisma.users.upsert({
      where: { userId: user.userId }, // 根据 userId 查找
      update: {
        email: user.email,
        username: user.username,
        // avatar: user.avatar || "",
        // passwordHash: passwordHash,
        updatedAt: new Date(), // 更新时设置更新时间
      },
      create: {
        userId: user.userId,
        // avatar: user.avatar || "",
        email: user.email,
        username: user.username,
        // passwordHash: passwordHash,
        createdAt: new Date(), // 创建时设置创建时间
      },
    });

    console.log("User synced to backup:", backupUser);
  } catch (error) {
    console.error("Error syncing user to backup:", error);
  }
}
