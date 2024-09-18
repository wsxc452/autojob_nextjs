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
import { referrerCode } from "@/service/referrerCodeService";

const model = prisma.wordsRecord;

function isCodeTimeValid(
  codeTime: Date,
  startTime: Date | null,
  endTime: Date | null,
) {
  const codeDay = dayjs(codeTime);

  // 检查 startTime 和 endTime 是否为空
  const startDay = startTime ? dayjs(startTime) : null;
  const endDay = endTime ? dayjs(endTime) : null;

  // 如果 startTime 为空，则只检查 codeTime 是否小于 endTime
  // 如果 endTime 为空，则只检查 codeTime 是否大于 startTime
  // 如果 startTime 和 endTime 都为空，则总是返回 true
  if (!startDay && !endDay) {
    return true;
  }

  if (startDay && endDay) {
    return codeDay.isAfter(startDay) && codeDay.isBefore(endDay);
  }

  if (!startDay) {
    return codeDay.isBefore(endDay);
  }

  if (!endDay) {
    return codeDay.isAfter(startDay);
  }

  return false;
}

function isValidateCode(code: string) {
  return code.length >= 4 && code.length <= 20;
}
function getDescText(codeInfo: any) {
  return JSON.stringify({ ...codeInfo });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = auth().protect();
  const { code, redeemedBy } = body;
  // console.log("body", body);
  if (!isValidateCode(code)) {
    return jsonReturn({ error: "请输入正确的code" }, 400);
  }
  if (!redeemedBy || redeemedBy === "") {
    return jsonReturn({ error: "请输入正确的兑换用户" }, 400);
  }
  const codeUper = code.toUpperCase();
  try {
    const codeInfo = await prisma.words.findFirst({
      where: {
        word: codeUper,
      },
    });
    // console.log("codeInfo", codeInfo);
    if (!codeInfo) {
      return jsonReturn({ error: "该口令不存在" }, 400);
    }
    // 检测是否需要绑定用户
    const isNeedBindReferrer = codeInfo.isBindUser;
    // 如果是绑定口令,则没有时间限制,也没有次数限制
    if (isNeedBindReferrer) {
      if (codeInfo.bindUserId === redeemedBy) {
        return jsonReturn({ error: "不能绑定自己的推广口令" }, 400);
      }
      // 检测是否已经绑定过,如果绑定过,则提示用户次口令"该口令为推广口令,您已领取过此类奖励"
      const bindInfo = await prisma.referrerBindRecord.findFirst({
        where: {
          userId: redeemedBy,
        },
      });
      if (bindInfo) {
        return jsonReturn(
          { error: "该口令为推广口令,仅限领取过绑定口令" },
          400,
        );
      }

      const codeInfoNew = {
        id: codeInfo.id,
        desc: "",
        code: codeUper,
        type: codeInfo.type,
        price: 0,
        points: codeInfo.points,
        money: 0,
        logType: AcountLogType.WORDBINDREFERRER,
        isBindUser: codeInfo.isBindUser || false,
        bindUserId: codeInfo.bindUserId || "",
      };
      codeInfoNew.desc = `绑定口令,积分${codeInfoNew.points},金额${codeInfoNew.money},类型${codeInfo.type}`;

      const [ret1, ret3] = await prisma.$transaction([
        prisma.wordsRecord.create({
          data: {
            userId: redeemedBy,
            points: codeInfo.points,
            money: 0,
            cardType: codeInfo.type,
            wordCode: codeUper,
            wordId: codeInfo.id,
            wordInfo: getDescText(codeInfoNew),
            bindUserId: codeInfo.bindUserId,
            bindUserEmail: codeInfo.bindUserEmail,
          },
        }),
        prisma.words.update({
          data: {
            remainderCount: {
              decrement: 1,
            },
          },
          where: {
            word: codeUper,
          },
        }),
      ]);

      const reRet = await referrerCode(
        redeemedBy,
        AcountLogType.WORDBINDREFERRER,
        codeUper,
      );
      return jsonReturn({ message: "口令绑定成功", data: codeInfo, reRet });
    } else {
      // 检测是否超过有效期
      if (!isCodeTimeValid(new Date(), codeInfo.startTime, codeInfo.endTime)) {
        return jsonReturn({ error: "该口令已经过期" }, 400);
      }
      // 检测是否超过领取次数
      // const wordsRecord = await prisma.wordsRecord.count({
      //   where: {
      //     wordCode: codeUper,
      //   },
      // });

      // 每个用户只能领取一次
      const wordsRecordUser = await prisma.wordsRecord.findFirst({
        where: {
          wordCode: codeUper,
          userId: redeemedBy,
        },
      });

      if (wordsRecordUser) {
        return jsonReturn({ error: `'${codeUper}'口令已经领取过` }, 400);
      }

      if (codeInfo.remainderCount <= 0) {
        return jsonReturn({ error: `'${codeUper}'口令已经超过领取次数` }, 400);
      }

      // if (wordsRecord >= codeInfo.maxCount) {
      //   return jsonReturn({ error: `'${codeUper}'口令已经超过领取次数` }, 400);
      // }

      const userInfo = await prisma.users.findFirstOrThrow({
        where: {
          userId: redeemedBy,
        },
      });
      if (codeInfo.type === "POINTS") {
        // 更新用户积分和卡片状态
        const codeInfoNew = {
          id: codeInfo.id,
          desc: "领取口令积分奖励",
          code: codeUper,
          type: codeInfo.type,
          price: 0,
          points: codeInfo.points,
          money: 0,
          logType: AcountLogType.WORDCHARGE,
          isBindUser: codeInfo.isBindUser || false,
          bindUserId: codeInfo.bindUserId || "",
        };
        codeInfoNew.desc = `口令,积分${codeInfoNew.points},金额${codeInfoNew.money},类型${codeInfo.type}`;

        await incrementPoints(
          redeemedBy,
          codeInfoNew,
          codeInfo.points,
          0,
          redeemedBy,
          false,
          AcountLogType.WORDCHARGE,
        );
        const [ret1, ret3] = await prisma.$transaction([
          prisma.wordsRecord.create({
            data: {
              userId: redeemedBy,
              points: codeInfoNew.points,
              money: 0,
              cardType: codeInfoNew.type,
              wordCode: codeUper,
              wordId: codeInfo.id,
              wordInfo: getDescText(codeInfoNew),
              bindUserId: null,
              bindUserEmail: null,
            },
          }),
          prisma.words.update({
            data: {
              remainderCount: {
                decrement: 1,
              },
            },
            where: {
              word: codeUper,
            },
          }),
        ]);
        return jsonReturn({ message: "口令绑定成功", data: codeInfo });
      } else {
        const codeInfoNewTime = {
          id: codeInfo.id,
          desc: "",
          code: codeUper,
          type: codeInfo.type,
          price: 0,
          points: 0,
          money: 0,
          logType: AcountLogType.WORDCHARGE,
          isBindUser: codeInfo.isBindUser || false,
          bindUserId: codeInfo.bindUserId || "",
        };
        codeInfoNewTime.desc = `口令,积分${codeInfoNewTime.points},金额${codeInfoNewTime.money},类型${codeInfoNewTime.type}`;

        const { isNewAppend, endTime } = await incrementDateTime(
          redeemedBy,
          codeInfoNewTime,
          userInfo,
          redeemedBy,
          false,
          AcountLogType.WORDCHARGE,
        );

        // console.log("isBeforeNow", isNewAppend, userInfo.cardStartTime);
        const [ret1, ret3] = await prisma.$transaction([
          prisma.wordsRecord.create({
            data: {
              userId: redeemedBy,
              points: codeInfoNewTime.points,
              money: 0,
              cardType: codeInfoNewTime.type,
              wordCode: codeUper,
              wordId: codeInfo.id,
              wordInfo: getDescText(codeInfoNewTime),
            },
          }),
          prisma.words.update({
            data: {
              remainderCount: {
                decrement: 1,
              },
            },
            where: {
              word: codeUper,
            },
          }),
        ]);
        // 口令的话,没有card信息
        return jsonReturn({
          message: "成功激活口令",
          data: endTime,
          codeInfo,
          info: dayjs(endTime).format("YYYY-MM-DD HH:mm:ss"),
          ret1,
          ret3,
        });
      }
    }
  } catch (e: any) {
    console.error(e);
    return jsonReturn({ error: e.message || "账户增加失败" }, 500);
  }
}
