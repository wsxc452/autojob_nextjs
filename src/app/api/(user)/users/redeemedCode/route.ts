import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "@/app/api/common/common";
import { CardType } from "@prisma/client";
import dayjs from "dayjs";

function isValidateCode(code: string) {
  return /^[0-9A-Za-z]*$/.test(code);
}

function getAddTimesByType(type: CardType, startTime?: Date | null) {
  if (!startTime) {
    startTime = dayjs().toDate();
  }
  switch (type) {
    case CardType.DAILY:
      return dayjs(startTime).add(1, "day").toDate();
    case CardType.MONTHLY:
      return dayjs(startTime).add(1, "month").toDate();
    case CardType.QUARTERLY:
      return dayjs(startTime).add(3, "month").toDate();
    case CardType.HALF_YEARLY:
      return dayjs(startTime).add(6, "month").toDate();
    case CardType.YEARLY:
      return dayjs(startTime).add(1, "year").toDate();
    default:
      return null;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  auth().protect();
  const { code, redeemedBy } = body;

  if (!isValidateCode(code)) {
    return jsonReturn({ error: "请输入正确的code" }, 400);
  }
  if (!redeemedBy || redeemedBy === "") {
    return jsonReturn({ error: "请输入正确的兑换用户" }, 400);
  }

  try {
    const codeInfo = await prisma.cards.findFirst({
      where: {
        code: code,
      },
      include: {
        cardTypes: true,
      },
    });
    console.log("codeInfo", codeInfo);
    if (!codeInfo) {
      return jsonReturn({ error: "该卡片不存在" }, 400);
    }
    if (codeInfo.isRedeemed) {
      return jsonReturn({ error: "该卡片已被兑换" }, 400);
    }

    // 需要查看这个卡密是否每人只能用一次;
    if (codeInfo.cardTypes.onlyOneTime === true) {
      const used = await prisma.cards.findFirst({
        where: {
          cardTypesId: codeInfo.cardTypesId,
          isRedeemed: true,
          redeemedBy: redeemedBy,
        },
      });
      console.log("used---->", used);
      if (used) {
        return jsonReturn({ error: "本类型卡密只能充值一次" }, 400);
      }
    }

    const balance = codeInfo.value;
    const now = new Date();

    // todo
    // check the card type, if type is points, then add points to user

    if (codeInfo.cardTypes.type === "POINTS") {
      // 更新用户积分和卡片状态
      const updatedUser = await prisma.$transaction([
        prisma.users.update({
          where: { userId: redeemedBy },
          data: {
            points: {
              increment: balance,
            },
          },
        }),
        prisma.cards.update({
          where: { code: code },
          data: {
            isRedeemed: true,
            redeemedBy: redeemedBy,
            redeemedAt: now,
            updatedAt: now,
          },
        }),
      ]);

      return jsonReturn({ message: "账户增加成功", data: balance });
    } else {
      const userInfo = await prisma.users.findFirstOrThrow({
        where: {
          userId: redeemedBy,
        },
      });

      // update user card time status
      // check the card type, if type is time, then add time to user
      // check user cardStartTime is before now, if not, then set cardStartTime to now\
      let isNewAppend = false;
      let endTime: Date | null = now;
      if (!userInfo.cardStartTime || !userInfo.cardEndTime) {
        isNewAppend = true;
        endTime = getAddTimesByType(codeInfo.type);
      } else {
        const hasEnoughTime = dayjs(userInfo.cardEndTime).isAfter(dayjs());
        endTime = getAddTimesByType(
          codeInfo.type,
          hasEnoughTime ? userInfo.cardEndTime : null,
        );
      }
      // const isBeforeNow = dayjs().isBefore(dayjs(userInfo.cardStartTime));

      console.log("isBeforeNow", isNewAppend, endTime, userInfo.cardStartTime);
      if (isNewAppend) {
        const updatedUser = await prisma.$transaction([
          prisma.users.update({
            where: { userId: redeemedBy },
            data: {
              cardStartTime: now,
              cardEndTime: endTime,
              // points: {
              //   increment: balance,
              // },
            },
          }),
          prisma.cards.update({
            where: { code: code },
            data: {
              isRedeemed: true,
              redeemedBy: redeemedBy,
              redeemedAt: now,
              updatedAt: now,
              cardStartTime: now,
              cardEndTime: endTime,
            },
          }),
        ]);
      } else {
        // append time to user
        const updatedUser = await prisma.$transaction([
          prisma.users.update({
            where: { userId: redeemedBy },
            data: {
              cardEndTime: endTime,
            },
          }),
          prisma.cards.update({
            where: { code: code },
            data: {
              isRedeemed: true,
              redeemedBy: redeemedBy,
              redeemedAt: now,
              updatedAt: now,
              // cardStartTime: userInfo.cardStartTime,
              cardEndTime: endTime,
            },
          }),
        ]);
      }

      return jsonReturn({
        message: "账户增加成功",
        data: endTime,
        info: dayjs(endTime).format("YYYY-MM-DD HH:mm:ss"),
      });
    }
  } catch (e: any) {
    return jsonReturn({ error: e.message || "账户增加失败" }, 500);
  }
}
