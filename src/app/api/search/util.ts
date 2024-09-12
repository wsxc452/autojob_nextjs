import prisma from "@/db";
import { getChinaTime } from "@/app/pc/common/util";
import dayjs from "dayjs";
export const AccountCheckError = class AccountCheckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccountCheckError";
  }
};
type CheckAcountReturn = {
  isUsePoints: boolean;
  status: boolean;
  points?: number;
  cardEndTime?: Date;
  msg: string;
};

const USERCOUNTZOUE = "用户余额不足";
function checkUserAccount(userInfo: any): CheckAcountReturn {
  let msg = "";
  let isUsePoints = true;
  if (!userInfo.cardEndTime) {
    // check is has points
    if (userInfo.points <= 0) {
      msg = USERCOUNTZOUE;
      return {
        isUsePoints,
        status: false,
        msg,
      };
    } else {
      msg = `用户余额: ${userInfo.points - 1}`;
    }
  } else {
    // check cardEndTime is valid
    const hasTimeLeft = dayjs(userInfo.cardEndTime).isAfter(dayjs());
    if (!hasTimeLeft) {
      // check is has points, if hasTimeLeft is false, then use points and check points
      isUsePoints = true;
      console.log("用户卡密已过期,check userInfo.points", userInfo.points);
      if (userInfo.points <= 0) {
        msg = USERCOUNTZOUE;
        return {
          status: false,
          isUsePoints,
          msg,
        };
      } else {
        isUsePoints = true;
        msg = `用户卡密已过期,用户余额: ${userInfo.points - 1}`;
      }
    } else {
      isUsePoints = false;
      msg = `用户卡密有效期: ${getChinaTime(userInfo.cardEndTime)}`;
    }
  }
  // console.log("checkUserAccount", userInfo);
  return {
    isUsePoints,
    status: true,
    points: userInfo.points - 1,
    cardEndTime: userInfo.cardEndTime,
    msg,
  };
}

export const checkAndSubscibeUserAccount = async (
  userId: string,
): Promise<{
  checkInfo: any;
  points: number;
  isUsePoints: boolean;
  cardEndTime: Date | undefined;
}> => {
  try {
    const userInfo = await prisma.users.findUniqueOrThrow({
      where: {
        userId: userId,
      },
    });
    let userAccountPoints = userInfo.points;
    // first check user is Has cardEndTime
    const checkRet = checkUserAccount(userInfo);
    if (checkRet.status) {
      // message.info("用户账户正常" + checkRet.msg);
      // if isUsePoints is true, then use points
      if (checkRet.isUsePoints) {
        console.log("用户账户余额不足,使用积分");
        const userPoints = await prisma.users.update({
          where: {
            userId,
          },
          select: {
            points: true,
            cardEndTime: true,
            cardStartTime: true,
          },
          data: {
            points: {
              decrement: 1,
            },
          },
        });
        userAccountPoints -= 1;
      }
      return {
        checkInfo: checkRet,
        isUsePoints: checkRet.isUsePoints,
        points: userAccountPoints,
        cardEndTime: checkRet.cardEndTime,
      };
    } else {
      // message.error(checkRet.msg);
      //   console.error(checkRet.msg);
      // throw new Error(checkRet.msg);
      throw new Error(checkRet.msg || "用户余额不足1");
    }
  } catch (e: any) {
    throw new AccountCheckError(e.toString() || "用户余额不足2");
  }
};
