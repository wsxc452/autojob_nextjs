import { NextResponse } from "next/server";
import { jsonReturn } from "../../common/common";
import { auth } from "@clerk/nextjs/server";
import { FilterCompony, FilterPosition } from "@/types";
import prisma from "@/db";
import { GreetingsType } from "@prisma/client";

export async function POST(request: Request) {
  const { userId } = auth().protect();
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    // const buffer = new Uint8Array(arrayBuffer);
    // await fs.writeFile(`./public/uploads/${file.name}`, buffer);

    const textDecoder = new TextDecoder("utf-8");
    const fileContent = textDecoder.decode(arrayBuffer);

    // 检查文件内容
    console.log(fileContent); // 打印文件内容以进行调试
    // 调用接口新增数据

    const dataJson = JSON.parse(fileContent);
    delete dataJson.id;
    const hasMore = Object.keys(dataJson).length > 4;
    const keywords = dataJson.filteredKeywords || [];
    const positions = dataJson.positionKeywords || [];
    const passCompanys = dataJson.passCompanys || [];

    //body.filteredKeywords.map((item: any) => {return item.keyword},
    console.log("=====", dataJson);
    const greetingGroup = { ...dataJson.GreetingGroup };
    const greetings = Array.from(dataJson.greetings || []);
    delete dataJson.hasMore;
    delete dataJson.greetings;
    delete dataJson.GreetingGroup;
    delete dataJson.search;
    let greetingGroupId: number | null = null;
    if (greetingGroup) {
      const greetingGroupData = Object.assign(
        {},
        {
          userId,
          name: greetingGroup.name,
        },
      );
      const addGreetingGroup = await prisma.greetingGroup.create({
        data: greetingGroupData,
      });
      greetingGroupId = addGreetingGroup.id;
      if (greetings.length > 0) {
        const greetingData = greetings.map((item: any) => {
          return {
            userId,
            content: item.content,
            status: GreetingsType.ACTICE,
            greetingGroupId: greetingGroupId!,
          };
        });
        await prisma.greetings.createMany({
          data: greetingData,
        });
      }
    }
    dataJson.greetingGroupId = greetingGroupId;

    // 使用 Prisma create任务数据
    if (hasMore) {
      // // 新增greetingGroup
      const newBody = Object.assign({}, dataJson, {
        filteredKeywords: {
          create: keywords.map((item: FilterCompony) => {
            return {
              keyword: item.keyword,
              userId,
            };
          }),
        },
        positionKeywords: {
          create: positions.map((item: FilterPosition) => {
            return {
              keyword: item.keyword,
              userId,
            };
          }),
        },
        passCompanys: {
          create: passCompanys.map((item: FilterPosition) => {
            return {
              keyword: item.keyword,
              userId,
            };
          }),
        },
        userId,
      });
      console.log("newBody", newBody);
      const createdTask = await prisma.tasks.create({
        data: newBody,
      });

      // 返回更新后的任务数据
      return jsonReturn(createdTask);
    } else {
      const newBody = Object.assign({}, dataJson, { userId });
      const createdTask = await prisma.tasks.create({
        data: newBody,
      });
      // 返回更新后的任务数据
      return jsonReturn(createdTask);
    }
  } catch (e: any) {
    console.error(e);
    return jsonReturn({ error: e.toString() }, 500);
  }
}
