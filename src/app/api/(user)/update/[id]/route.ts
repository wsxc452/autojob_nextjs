import { jsonReturn } from "@/app/api/common/common";
import prisma from "@/db";
import { checkAdminOrThrow } from "@/service/users";
import { UpdateUserType } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

type Params = {
  id: string;
};

const model = prisma.users;
export async function POST(request: NextRequest, context: { params: Params }) {
  const body = await request.json();
  const { userId } = auth().protect();
  const { id } = context.params;
  console.log("body", body, context.params);
  const { updateType, ...rest } = body;
  if (!id) {
    return jsonReturn({ message: "请输入正确的用户ID" }, 400);
  }

  try {
    // 检测是否是管理员, 不是则返回错误
    await checkAdminOrThrow(userId);
    if (updateType === UpdateUserType.Disable) {
      console.log("1", id);

      const updateRet = await prisma.users.upsert({
        where: { userId: id }, // 根据 userId 查找
        update: {
          isAbnormal: rest.isAbnormal,
          updatedAt: new Date(), // 更新时设置更新时间
        },
        create: {
          userId: id,
          // avatar: user.avatar || "",
          email: body.email!,
          firstName: body.firstName,
          lastName: body.lastName,
          fullName: body.fullName,
          isAbnormal: rest.isAbnormal,
          // passwordHash: passwordHash,
          createdAt: new Date(), // 创建时设置创建时间
        },
      });

      return jsonReturn(updateRet);
    } else if (updateType === UpdateUserType.IncreasePoint) {
      const updatedTask = await model.update({
        where: {
          userId: id,
        },
        data: {
          points: {
            increment: rest.points,
          },
        },
      });

      return jsonReturn(updatedTask);
    } else {
      return jsonReturn({ message: "未知操作" }, 400);
    }
  } catch (e: any) {
    console.error(e);
    return jsonReturn({ message: e.message || "发卡失败" }, 500);
  }
}
