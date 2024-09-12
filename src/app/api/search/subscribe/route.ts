import { NextRequest } from "next/server";
import { jsonReturn } from "../../common/common";
import { auth } from "@clerk/nextjs/server";
import { checkAndSubscibeUserAccount } from "../util";
type Params = {
  id: string;
};

export async function GET(request: NextRequest, context: { params: Params }) {
  //   const bodyParams = await request.json();
  const { userId } = auth().protect();
  // const bodyText = await request.text();
  // 获取请求体
  // 将 URL 编码的字符串解析为对象
  //   const userId = bodyParams.userId;
  try {
    const checkRet = await checkAndSubscibeUserAccount(userId);
    return jsonReturn({ ...checkRet });
  } catch (e: any) {
    return jsonReturn({ error: e.toString() }, 500);
  }
}
