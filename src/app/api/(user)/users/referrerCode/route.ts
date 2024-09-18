import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "@/app/api/common/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { referrerCode } from "@/service/referrerCodeService";
import { AcountLogType } from "@prisma/client";

function isValidateCode(code: string) {
  return code.trim().length > 4;
}

// function getAddTimesByType(type: CardType, startTime?: Date | null) {
//   if (!startTime) {
//     startTime = dayjs().toDate();
//   }
//   switch (type) {
//     case CardType.DAILY:
//       return dayjs(startTime).add(1, "day").toDate();
//     case CardType.MONTHLY:
//       return dayjs(startTime).add(1, "month").toDate();
//     case CardType.QUARTERLY:
//       return dayjs(startTime).add(3, "month").toDate();
//     case CardType.HALF_YEARLY:
//       return dayjs(startTime).add(6, "month").toDate();
//     case CardType.YEARLY:
//       return dayjs(startTime).add(1, "year").toDate();
//     default:
//       return null;
//   }
// }

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = auth().protect();
  const { code } = body;
  try {
    // 检测是否已经绑定过推荐人
    const reRet = await referrerCode(userId, AcountLogType.BINDREFERRER, code);
    return jsonReturn({ message: "账户增加成功", data: reRet });
  } catch (e: any) {
    console.error(e);
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return jsonReturn({ error: "已经领取过奖励" }, 400);
      }
      return jsonReturn({ error: e.message || "失败" }, 500);
    }
    return jsonReturn({ error: e.message || "失败" }, 500);
  }
}
