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
  // const saveRet = await saveCity();
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
  // console.log("ret====", ret);
  // const ret = await prisma.city.findMany({
  //   where: {
  //     from: from,
  //   },
  //   select: {
  //     id: true,
  //     name: true,
  //     code: true,
  //     from: true,
  //     pinyin: true,
  //   },
  // });
  return jsonReturn(ret);
}
