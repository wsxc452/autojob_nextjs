import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "@/app/api/common/common";
import { AcountLogType, Cards, CardType, Users } from "@prisma/client";
import dayjs from "dayjs";
import {
  incrementDateTime,
  incrementPoints,
  PriceInfo,
} from "@/app/api/service/pointService";

function isValidateCode(code: string) {
  return /^[0-9A-Za-z]*$/.test(code);
}
function getDescText(codeInfo: any) {
  const {
    id,
    title,
    code,
    type,
    price,
    value,
    cardEndTime,
    cardStartTime,
    cardTypesId,
  } = codeInfo;
  const desc = JSON.stringify({
    id,
    title,
    code,
    type,
    price,
    value,
    cardEndTime,
    cardStartTime,
    cardTypesId,
  });
  return desc;
}

async function referrerAdd(
  redeemedBy: string,
  codeInfo: PriceInfo & {
    id: number;
    code: string;
  },
) {
  try {
    const referrerBindRecord = await prisma.referrerBindRecord.findFirst({
      where: {
        userId: redeemedBy,
      },
    });

    if (referrerBindRecord) {
      const increamentPoint = parseInt(codeInfo.price + "") * 100 * 0.2; // 积分需要根据月卡金额计算
      codeInfo.points = increamentPoint;
      codeInfo.desc = `返利,积分${codeInfo.points},金额${codeInfo.price},类型${codeInfo.type}`;
      await incrementPoints(
        referrerBindRecord.codeUserId,
        codeInfo,
        increamentPoint,
        0,
        redeemedBy,
        true,
        AcountLogType.CODECHARGE,
      );
    } else {
      console.log(`未绑定推广人,无需返利`);
    }
    const desc = getDescText(codeInfo);
    await prisma.referrerRecord.create({
      data: {
        userId: redeemedBy,
        points: 0,
        money: 0,
        cardInfo: desc,
        cardCode: codeInfo.code,
        codeUserId:
          (referrerBindRecord && referrerBindRecord?.codeUserId) || "",
        codeIsVip: false,
        cardType: codeInfo.type,
        cardId: codeInfo.id,
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  auth().protect();
  const { code, redeemedBy } = body;
  console.log("body", body);
  if (!isValidateCode(code)) {
    return jsonReturn({ error: "请输入正确的code" }, 400);
  }
  if (!redeemedBy || redeemedBy === "") {
    return jsonReturn({ error: "请输入正确的兑换用户" }, 400);
  }
  const codeUper = code.toUpperCase();
  try {
    const codeInfo = await prisma.cards.findFirst({
      where: {
        code: code.toUpperCase(),
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
    const userInfo = await prisma.users.findFirstOrThrow({
      where: {
        userId: redeemedBy,
      },
    });

    if (codeInfo.type === "POINTS") {
      // 更新用户积分和卡片状态
      const codeInfoNew = {
        id: codeInfo.id,
        desc: "充值积分",
        code: codeUper,
        type: codeInfo.type,
        price: codeInfo.price,
        points: codeInfo.value,
        money: 0,
        logType: AcountLogType.CODECHARGE,
      };
      codeInfoNew.desc = `充值,积分${codeInfoNew.points},金额${codeInfoNew.money},类型${codeInfoNew.type}`;
      await incrementPoints(
        redeemedBy,
        codeInfoNew,
        balance,
        0,
        redeemedBy,
        false,
        AcountLogType.CODECHARGE,
      );
      await prisma.cards.update({
        where: { code: code },
        data: {
          isRedeemed: true,
          redeemedBy: redeemedBy,
          redeemedAt: now,
          updatedAt: now,
        },
      });
      // 推荐人返利,
      await referrerAdd(redeemedBy, codeInfoNew);

      return jsonReturn({ message: "账户增加成功", data: balance });
    } else {
      const codeInfoNewTime = {
        id: codeInfo.id,
        desc: "",
        code: codeUper,
        type: codeInfo.type,
        price: codeInfo.price,
        points: 0,
        money: 0,
        logType: AcountLogType.CODECHARGE,
      };
      codeInfoNewTime.desc = `充值,积分${codeInfoNewTime.points},金额${codeInfoNewTime.money},类型${codeInfoNewTime.type}`;
      const { isNewAppend, endTime } = await incrementDateTime(
        redeemedBy,
        codeInfoNewTime,
        userInfo,
        redeemedBy,
        false,
        AcountLogType.CODECHARGE,
      );

      console.log("isBeforeNow", isNewAppend, userInfo.cardStartTime);

      await prisma.cards.update({
        where: { code: code },
        data: Object.assign(
          {
            isRedeemed: true,
            redeemedBy: redeemedBy,
            redeemedAt: now,
            updatedAt: now,
            cardEndTime: endTime,
          },
          isNewAppend
            ? {
                cardStartTime: now,
              }
            : {},
        ),
      });
      // 推荐人返利,
      await referrerAdd(redeemedBy, codeInfoNewTime);
      return jsonReturn({
        message: "账户增加成功",
        data: endTime,
        codeInfo,
        info: dayjs(endTime).format("YYYY-MM-DD HH:mm:ss"),
      });
    }
  } catch (e: any) {
    return jsonReturn({ error: e.message || "账户增加失败" }, 500);
  }
}
