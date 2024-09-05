import prisma from "@/db";
import { NextRequest } from "next/server";
import { jsonReturn } from "../../common/common";
import { auth } from "@clerk/nextjs/server";
type Params = {
  id: string;
};
export async function GET(_request: NextRequest, context: { params: Params }) {
  const { userId } = auth().protect();
  const { searchParams } = new URL(_request.url); // 获取 URL 对象
  const taskId = searchParams.get("id"); // 获取查询参数

  if (!taskId) {
    return jsonReturn({ error: "请输入正确的任务id" }, 400);
  }
  const retInfo = {
    userInfo: {},
    taskInfo: {},
    chromeInfo: {},
  };
  let groupId = null;
  try {
    const taskInfo = await prisma.tasks.findFirstOrThrow({
      where: {
        id: parseInt(taskId),
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
        passCompanys: {
          select: {
            id: true,
            keyword: true,
          },
          take: 100,
        },
        // search: {
        //   select: {
        //     md5: true,
        //   },
        // },
      },
    });
    retInfo.taskInfo = taskInfo;
    groupId = taskInfo.greetingGroupId;
  } catch (e) {
    console.error(e);
    return jsonReturn(
      {
        error: "找不到任务",
        code: "10003",
      },
      400,
    );
  }

  try {
    // 先找到taskInfo
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
            greetingGroupId: true,
          },
          where: {
            greetingGroupId: groupId!,
          },
          take: 10,
        },
      },
      // include: {},
    });

    retInfo.userInfo = userInfo;
  } catch (e) {
    return jsonReturn(
      {
        error: "找不到用户",
        code: "10002",
      },
      400,
    );
  }

  //   console.log("taskInfo", taskInfo);/
  //   const userInfo = await prisma.users.findFirstOrThrow({
  //     where: {
  //       id: parseInt(context.params.id),
  //     },
  //   });

  return jsonReturn(retInfo);
}
