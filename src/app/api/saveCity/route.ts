import { NextRequest } from "next/server";
import { jsonReturn } from "../common/common";
import { saveCity } from "@/service/city";
import prisma from "@/db";
// import { cache } from "react";
type Params = {};
// export async function GET(request: NextRequest, context: { params: Params }) {
//   const saveRet = await saveCity();
//   return jsonReturn(saveRet);
// }
//  /api/city 保存city;
export async function GET(request: NextRequest, context: { params: Params }) {
  const count = await prisma.city.count();
  if (count !== 0) {
    return jsonReturn({ count, msg: "已经存在数据!" });
  }
  const saveRet = await saveCity();
  // if data is not empty, return error
  // return jsonReturn(saveRet);
  const from = "BOSS";

  const ret = await prisma.city.findMany({
    where: {
      from: from,
    },
    select: {
      id: true,
      name: true,
      code: true,
      // from: true,
      pinyin: true,
    },
  });
  console.log("ret====", ret);
  await prisma.city.findMany({
    where: {
      from: from,
    },
    select: {
      id: true,
      name: true,
      code: true,
      from: true,
      pinyin: true,
    },
  });
  return jsonReturn({ count, msg: "已经新增数据" });
}
