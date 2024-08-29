import prisma from "@/db";
import { NextRequest } from "next/server";
import { jsonReturn } from "../../common/common";
import { auth } from "@clerk/nextjs/server";
type Params = {
  id: string;
};
export async function GET(_request: NextRequest, context: { params: Params }) {
  const { userId } = auth().protect();
  const taskId = 10;
  const retInfo = {
    userInfo: {
      userId: userId,
      points: 0,
    },
    taskInfo: {},
    chromeInfo: {},
  };

  const userInfo = await prisma.users.findFirstOrThrow({
    where: {
      userId: userId,
    },
    select: {
      userId: true,
      points: true,
      email: true,
      greetings: {
        select: {
          id: true,
          content: true,
        },
        take: 10,
      },
    },
    // include: {},
  });

  retInfo.userInfo = userInfo;

  const taskInfo = await prisma.tasks.findFirstOrThrow({
    where: {
      id: taskId,
      userId: userId,
    },
    include: {
      positionKeywords: {
        select: {
          id: true,
          keyword: true,
        },
        take: 100,
      },
      filteredKeywords: {
        select: {
          id: true,
          keyword: true,
        },
        take: 100,
      },
    },
  });
  retInfo.taskInfo = taskInfo;
  console.log("taskInfo", taskInfo);

  //   const userInfo = await prisma.users.findFirstOrThrow({
  //     where: {
  //       id: parseInt(context.params.id),
  //     },
  //   });

  return jsonReturn(retInfo);
}
