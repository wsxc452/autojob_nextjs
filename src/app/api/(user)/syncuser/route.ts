import prisma from "@/db";
import { GreetingsType, PrismaClient, Users } from "@prisma/client";
import { jsonReturn } from "../../common/common";

export async function GET(request: Request) {
  return jsonReturn({ data: "syncuser" });
}
export async function POST(request: Request) {
  const body = await request.json();
  try {
    // 哈希密码
    // const passwordHash = await hash(user.password, "sha256");
    // 初始化打招呼分组
    // 检测是否有默认分组
    const defaultGroup = await prisma.greetingGroup.findFirst({
      where: {
        userId: body.userId,
        name: "默认",
      },
    });
    if (!defaultGroup) {
      console.log("创建默认分组");
      const createData = await prisma.greetingGroup.create({
        data: {
          name: "默认",
          userId: body.userId,
        },
      });
      await prisma.greetings.create({
        data: {
          content: "您好，对公司的岗位很感兴趣，可以聊聊吗？",
          status: GreetingsType.ACTICE,
          userId: body.userId,
          greetingGroupId: createData.id,
        },
      });
    }

    // 同步用户到 UserBackup 表
    await prisma.users.upsert({
      where: { userId: body.userId }, // 根据 userId 查找
      update: {
        email: body.email,
        userName: body.userName || "",
        firstName: body.firstName,
        lastName: body.lastName,
        fullName: body.fullName,
        avatar: body.avatar || "",
        // passwordHash: passwordHash,
        updatedAt: new Date(), // 更新时设置更新时间
      },
      create: {
        userId: body.userId!,
        avatar: body.avatar || "",
        email: body.email!,
        firstName: body.firstName,
        lastName: body.lastName,
        fullName: body.fullName,
        userName: body.username || "",
        points: 0,
        isSuperUser: body.email === "wsxc452@gmail.com" ? true : false,
        // passwordHash: passwordHash,
        createdAt: new Date(), // 创建时设置创建时间
      },
    });

    // 返回同步后的用户
    const userInfo = await prisma.users.findFirstOrThrow({
      where: { userId: body.userId },
      select: {
        userId: true,
        email: true,
        userName: true,
        firstName: true,
        lastName: true,
        fullName: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        points: true,
        isSuperUser: true,
        isAbnormal: true,
        isVip: true,
        cardEndTime: true,
        cardStartTime: true,
        // greetings: {
        //   select: {
        //     id: true,
        //     content: true,
        //   },
        // },
      },
    });

    return jsonReturn(userInfo);
  } catch (error) {
    console.error("Error syncing user to backup:", error);
    return jsonReturn({ error: "Error syncing user to backup" }, 500);
  }
}
