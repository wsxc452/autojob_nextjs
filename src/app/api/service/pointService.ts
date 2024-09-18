import prisma from "@/db";
import { AcountLogType, Cards, CardType, Users } from "@prisma/client";
import dayjs from "dayjs";

export function getDescText(codeInfo: any) {
  let desc = "";

  // const {
  //   id,
  //   title,
  //   code,
  //   type,
  //   price,
  //   value,
  //   cardEndTime,
  //   cardStartTime,
  //   cardTypesId,
  // } = codeInfo;
  // desc = JSON.stringify({
  //   id,
  //   title,
  //   code,
  //   type,
  //   price,
  //   value,
  //   cardEndTime,
  //   cardStartTime,
  //   cardTypesId,
  // });
  desc = JSON.stringify({ ...codeInfo });

  return desc;
}
export type PriceInfo = {
  points: number;
  money: number;
  type: CardType;
  desc: string;
  logType: AcountLogType;
  [key: string]: any;
};

export const incrementPoints = async (
  userId: string,
  codeInfo: PriceInfo,
  points: number = 0,
  money: number = 0,
  byUserId: string = "",
  isReferrer: boolean = false, // 是否是被推荐人
  logType: AcountLogType,
) => {
  // 给本人增加积分记录

  // 新增积分或者余额变更记录表

  //   model UsersAccoutLog {
  //     id        Int      @id @default(autoincrement())
  //     userId    String   @db.VarChar(64) // 用户 ID
  //     points    Int      @default(0) // 积分数量，默认为 0
  //     money     Float    @default(0) // 金额，默认为 0
  //     createdAt DateTime @default(now()) // 创建时间
  //     updatedAt DateTime @updatedAt // 更新时间
  //     byUserId  String?  @db.VarChar(64) // 来源用户 ID
  //     byResaon  String?  @db.VarChar(200) // 来源原因
  //   }
  // 当用户是绑定推荐人增加积分时,不需要记录卡券信息;

  const desc = getDescText(codeInfo);
  const cardType = codeInfo.type;
  try {
    const [ret, ret2] = await prisma.$transaction([
      prisma.users.update({
        where: {
          userId: userId,
        },
        data: {
          points: {
            increment: points,
          },
          accountMoney: money,
        },
      }),
      prisma.usersAccoutLog.create({
        data: {
          userId: userId,
          points: points,
          money: money,
          byResaon: codeInfo.desc,
          cardType: cardType,
          byUserId: byUserId,
          isReferrer,
          desc: desc,
          type: logType,
        },
      }),
    ]);

    return [ret, ret2];
  } catch (e) {
    console.error(e);
    throw e;
  }
};

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

export const incrementDateTime = async (
  redeemedBy: string,
  codeInfo: PriceInfo,
  userInfo: Users, // 当前用户的时长信息
  // byResaon: string = "",
  byUserId: string = "",
  isReferrer: boolean = false,
  logType: AcountLogType,
) => {
  const now = new Date();
  // update user card time status
  // check the card type, if type is time, then add time to user
  // check user cardStartTime is before now, if not, then set cardStartTime to now\
  // 这里如果增加时长的话,需要自定义一个奖励时长;
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
  try {
    if (isNewAppend) {
      // 这里非Points,未做UserAccountRecord记录
      await prisma.users.update({
        where: { userId: redeemedBy },
        data: {
          cardStartTime: now,
          cardEndTime: endTime,
        },
      });
    } else {
      // append time to user
      await prisma.users.update({
        where: { userId: redeemedBy },
        data: {
          cardEndTime: endTime,
        },
      });
    }
    const desc = getDescText(codeInfo);
    const cardType = codeInfo.type;
    const [ret] = await prisma.$transaction([
      // prisma.referrerRecord.create({
      //   data: {
      //     userId: redeemedBy,
      //     points: 0,
      //     money: 0,
      //     cardInfo: desc,
      //     cardCode: codeInfo.code,
      //     codeUserId: byUserId,
      //     codeIsVip: false,
      //     cardType: codeInfo.type,
      //     cardId: codeInfo.id,
      //   },
      // }),
      prisma.usersAccoutLog.create({
        data: {
          userId: redeemedBy,
          points: 0,
          money: 0,
          cardType: cardType,
          byResaon: codeInfo.desc,
          byUserId: byUserId,
          isReferrer,
          desc: desc,
          type: logType,
        },
      }),
    ]);

    return { isNewAppend, endTime, data: [ret] };
  } catch (e) {
    console.error(e);
    throw e;
  }
};
