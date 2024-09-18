import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { jsonReturn } from "../../common/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
const model = prisma.words;
export async function PUT(request: NextRequest, context: { params: {} }) {
  const body = await request.json();
  const { userId } = auth().protect();
  console.log("bodybody", body);
  //body.filteredKeywords.map((item: any) => {return item.keyword},
  if (!body.word) {
    return jsonReturn({ error: "请输入正确的口令" }, 400);
  }
  const word = body.word.trim();
  if (word.length < 4) {
    return jsonReturn({ error: "请输入正确的口令,4-20位" }, 400);
  }
  // word 转成大写字母并且不能包含 C8
  console.log("word", word);
  if (word.toUpperCase().includes("C8")) {
    return jsonReturn({ error: "口令不能包含 C8" }, 400);
  }
  const maxCount = parseInt(body.maxCount || 0);
  if (maxCount <= 0) {
    return jsonReturn({ error: "请输入正确的maxCount" }, 400);
  }
  try {
    // 使用 Prisma 更新任务数据
    // bindUserEmail: "";
    // bindUserId: "";
    // points: 1000;
    // desc: "点券口令1000";
    // id: 0;
    // isBindUser: "false";
    // maxCount: 1;
    // time_range: [];
    // type: "POINTS";
    // word: "点券口令1000";
    let points = parseInt(body.points || 0);
    if (body.type !== "POINTS") {
      // 费点卡,点卡值0
      points = 0;
    }
    const bodyParsms = {
      word: body.word.toUpperCase(),
      points: points,
      type: body.type,
      isBindUser: body.isBindUser === "true" ? true : false,
      bindUserId: body.bindUserId || "",
      bindUserEmail: body.bindUserEmail || "",
      maxCount: maxCount,
      remainderCount: maxCount,
      desc: body.desc,
      startTime: body.time_range[0],
      endTime: body.time_range[1],
      createUserId: userId,
    };
    if (bodyParsms.isBindUser) {
      // 如果是绑定口令,则没有时间限制,也没有次数限制
      bodyParsms.startTime = null;
      bodyParsms.endTime = null;
      bodyParsms.maxCount = 0;
    } else {
      if (bodyParsms.type === "POINTS" && bodyParsms.points <= 0) {
        return jsonReturn({ error: "请输入正确的点券数量" }, 400);
      }
    }
    const updatedTask = await model.create({
      data: bodyParsms,
    });

    // 返回更新后的任务数据
    return jsonReturn(updatedTask);
  } catch (e: any) {
    // 处理错误情况
    if (e instanceof PrismaClientKnownRequestError) {
      return jsonReturn({ error: "口令已存在,请更换口令!" }, 400);
    }
    // console.error("Unknown Error:", e);
    const errorMessage = e.message || "Internal Server Error";
    return jsonReturn({ error: errorMessage }, 500);
  }
}
