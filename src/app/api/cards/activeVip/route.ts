import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../../common/common";
import prisma from "@/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = auth().protect();
  const { code, userId: userIdBody, isVip = "fasle" } = body;
  // code 允许为空,因为,可能之前用户已经激活普通会员,现在激活VIP会员
  console.log("body", body);

  if (!userIdBody || userIdBody.trim() === "") {
    return jsonReturn({ message: "请输入正确的userId" }, 500);
  }
  // 管理员可以帮忙激活,但是需要传入一个code
  if (isVip === "false" && (!code || code.trim() === "")) {
    return jsonReturn({ message: "请输入code" }, 500);
  }

  try {
    // 检测是否是管理员, 不是则返回错误
    const userInfo = await prisma.users.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });

    if (userInfo.isSuperUser === false) {
      return jsonReturn({ error: "You are not a super user" }, 500);
    }

    // 是否已经激活过
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        userId: userIdBody,
      },
    });

    // 检测用户是否存在非points类型的卡密核销记录
    const nowTime = new Date();
    if (isVip === "true") {
      if (user?.isVip && user?.isVip === true) {
        return jsonReturn({ message: "已经激活过" }, 500);
      }
      if (
        !code ||
        (code.trim() === "" &&
          (!user.referrerCode || user.referrerCode.trim() === ""))
      ) {
        return jsonReturn({ message: "请输入code" }, 500);
      }

      if (!user.isReferrer) {
        const referrer = await prisma.users.findFirst({
          where: {
            referrerCode: code,
          },
        });
        if (referrer) {
          return jsonReturn({ message: "code已经被使用" }, 500);
        }
      }

      const retInfo = await prisma.users.update({
        select: {
          userId: true,
          isVip: true,
          isReferrer: true,
          referrerCode: true,
          referrerTime: true,
          referrerVipTime: true,
        },
        where: {
          userId: userIdBody,
        },
        data: Object.assign(
          {
            referrerVipTime: nowTime,
            updatedAt: nowTime,
            isVip: true,
          },
          user.isReferrer
            ? {}
            : {
                referrerCode: code,
                referrerTime: nowTime,
                isReferrer: true,
              },
        ),
      });
      return jsonReturn({ retInfo });
    } else {
      console.log("激活普通会员");
      if (user?.referrerCode && user?.referrerCode.trim() !== "") {
        return jsonReturn({ message: "已经激活过" }, 500);
      }
      const referrer = await prisma.users.findFirst({
        where: {
          referrerCode: code,
        },
      });
      if (referrer) {
        return jsonReturn({ message: "code已经被使用" }, 500);
      }
      const retInfo = await prisma.users.update({
        where: {
          userId: userIdBody,
        },
        data: {
          referrerCode: code,
          referrerTime: nowTime,
          isReferrer: true,
          updatedAt: nowTime,
        },
      });
      return jsonReturn({ retInfo });
    }
  } catch (e: any) {
    console.error(e);
    return jsonReturn({ message: e.message || "未找到" }, 500);
  }
}
