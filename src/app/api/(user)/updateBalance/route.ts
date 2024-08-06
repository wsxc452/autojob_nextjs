import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { jsonReturn } from "../../common/common";
import { isNumberObject } from "util/types";

function isValidateCode(code: string) {
  return /^[0-9a-Z]*$/.test(code);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = auth().protect();
  const { code } = body;

  if (!isValidateCode(code)) {
    return jsonReturn({ error: "请输入正确的code" }, 400);
  }
  // get code Info

  //   if (!isNumberObject(balance)) {
  //     return jsonReturn({ error: "请输入正确的金额" }, 400);
  //   }
  try {
    const codeInfo = await prisma.cards.findFirstOrThrow({
      where: {
        code: code,
      },
    });
    const balance = codeInfo.value;
    const updatedUser = await prisma.users.update({
      where: { userId: userId },
      data: {
        points: {
          increment: balance,
        },
      },
    });
    return jsonReturn(updatedUser);
  } catch (e: any) {
    return jsonReturn({ error: e.message || "账户增加失败" }, 500);
  }
}
