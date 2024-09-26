import {
  getDescText,
  incrementDateTime,
  incrementPoints,
} from "@/app/api/service/pointService";
import prisma from "@/db";
import { AcountLogType, CardType, Words } from "@prisma/client";
function isValidateCode(code: string) {
  return code.trim().length > 4;
}

export const referrerCode = async function (
  codeInfoData: Words | null,
  userId: string,
  bindType: AcountLogType,
  code: string,
) {
  code = code.trim().toUpperCase();
  if (!isValidateCode(code)) {
    throw new Error("请输入正确的code");
  }

  try {
    // 检测是否已经绑定过推荐人
    const bindUserInfo = await prisma.users.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });

    // if (bindUserInfo.isBind) {
    //   throw new Error("已经绑定过推荐人");
    // }
    // 生成ReferrerRecord记录
    let reFerrerUserInfo;
    // not active code
    if (bindType === AcountLogType.BINDREFERRER) {
      reFerrerUserInfo = await prisma.users.findFirst({
        select: {
          referrerCode: true,
          userId: true,
          isVip: true,
          isReferrer: true,
          id: true,
          email: true,
        },
        where: {
          referrerCode: code,
          userId: {
            not: userId,
          },
        },
      });
      if (!reFerrerUserInfo) {
        throw new Error("该推荐码不存在");
      }
    } else {
      // AcountLogType.WORDBINDREFERRER
      // wordCode
      // const reFerrerWordUserInfo = await prisma.words.findFirst({
      //   where: {
      //     word: code,
      //   },
      // });
      const reFerrerWordUserInfo = codeInfoData;
      if (!reFerrerWordUserInfo) {
        throw new Error("该口令不存在");
      }
      reFerrerUserInfo = await prisma.users.findFirst({
        select: {
          referrerCode: true,
          userId: true,
          isVip: true,
          isReferrer: true,
          id: true,
          email: true,
        },
        where: {
          userId: reFerrerWordUserInfo.bindUserId,
        },
      });
      if (!reFerrerUserInfo) {
        throw new Error("该推荐人不存在");
      }
    }

    const referrUserId = reFerrerUserInfo.userId;

    // 绑定推荐人,可以模拟一个code类型卡券
    const PRICE_POINT = codeInfoData?.type === CardType.POINTS;
    let codeInfoJson: {
      money: number;
      point: number;
      referrPoint: number;
      code: string;
      logType: AcountLogType;
      time: CardType | null;
      referrerTime: CardType | null;
    } = {
      money: 0,
      point: 0,
      referrPoint: 0,
      time: null,
      referrerTime: null,
      code,
      logType: bindType,
    };
    if (PRICE_POINT) {
      // 奖励内容
      codeInfoJson = Object.assign(codeInfoJson, {
        point: codeInfoData?.points || 100,
        referrPoint: 100,
        code,
        logType: bindType,
      });
      // 给本人增加积分记录， 推广人增加固定100积分；
      const codeInfo = {
        desc: "绑定口令,",
        type: CardType.POINTS,
        money: 0,
        points: codeInfoJson.point,
        code,
        logType: bindType,
      };

      codeInfo.desc = `绑定口令,积分${codeInfo.points},金额${codeInfo.money},类型${codeInfo.type}`;
      await incrementPoints(
        userId,
        codeInfo,
        codeInfoJson.point,
        0,
        referrUserId,
        false,
        bindType,
      );
      const codeInfoReferrer = {
        desc: "",
        type: CardType.POINTS,
        money: 0,
        points: codeInfoJson.referrPoint,
        userId: userId,
        logType: bindType,
      };
      codeInfoReferrer.desc = `推广口令,积分${codeInfoReferrer.points},金额${codeInfoReferrer.money},类型${codeInfoReferrer.type}`;
      // 给推荐人增加记录
      await incrementPoints(
        referrUserId,
        codeInfoReferrer,
        codeInfoJson.referrPoint,
        0,
        userId,
        true,
        bindType,
      );
      //   codeInfoJson = getDescText(codeInfo);
    } else {
      // 奖励时间卡, 每人奖励一天卡
      // 绑定个人新增棒的卡类型， 推广人奖励日卡
      codeInfoJson = Object.assign(codeInfoJson, {
        time: codeInfoData?.type || CardType.DAILY,
        referrerTime: CardType.DAILY,
        code,
        logType: bindType,
      });
      const codeInfo = {
        desc: "",
        type: codeInfoJson.time!,
        points: 0,
        money: 0,
        code,
        logType: bindType,
      };
      codeInfo.desc = `绑定口令,积分${codeInfo.points},金额${codeInfo.money},类型${codeInfo.type}`;
      await incrementDateTime(
        userId,
        codeInfo,
        bindUserInfo,
        referrUserId,
        false,
        bindType,
      );

      // 给推荐人增加记录, 也是增加日卡
      const codeInfoReffer = {
        desc: "",
        type: codeInfoJson.referrerTime!,
        points: 0,
        money: 0,
        userId: userId,
        logType: bindType,
      };
      codeInfoReffer.desc = `推广口令,积分${codeInfoReffer.points},金额${codeInfoReffer.money},类型${codeInfoReffer.type}`;
      await incrementDateTime(
        referrUserId,
        codeInfoReffer,
        bindUserInfo,
        userId,
        true,
        bindType,
      );
    }
    // 推荐人奖励描述
    const reRet = await prisma.referrerBindRecord.create({
      data: {
        userId: userId, // 被推荐人id
        codeUserId: reFerrerUserInfo.userId, // 推荐人id
        codeIsVip: reFerrerUserInfo.isVip,
        points: PRICE_POINT ? codeInfoData?.points || 100 : 0,
        money: 0,
        code: code,
        cardType: codeInfoData?.type,
        userEmail: bindUserInfo.email, // 推荐人邮箱
        desc: JSON.stringify(codeInfoJson),
        bindType,
      },
    });

    return { message: "账户增加成功", data: reRet };
  } catch (e: any) {
    throw e;
  }
};
