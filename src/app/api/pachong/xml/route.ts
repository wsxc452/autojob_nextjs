import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { write, utils, WorkBook } from "xlsx";
import { jsonReturn } from "../../common/common";
import prisma from "@/db";

// 定义 GET 方法处理请求
export async function GET(request: NextRequest) {
  // const { userId } = auth().protect();
  const { searchParams } = new URL(request.url); // 获取 URL 对象
  const taskId = searchParams.get("id"); // 获取查询参数

  if (!taskId) {
    return jsonReturn({ error: "请输入正确的任务id" }, 400);
  }
  // 1. 定义数据
  // const data = [
  //   { 公司名: "John", 网站: "www", 邮箱: "Developer", 手机: "Developer" },
  // ];
  const datas = await prisma.paChongData.findMany({
    where: {
      ptaskId: parseInt(taskId),
    },
  });

  if (!datas || datas.length === 0) {
    return jsonReturn({ error: "没有数据,请先执行任务抓取!" }, 400);
  }
  // {"companyName":"View Profile: ZIZARUS CARGO","phone":"+234-8023014404","email":"zclog1965@hotmail.com","website":"www.zclog1965.com"}
  const data = datas.map((item) => {
    const dataJson = JSON.parse(item.data);
    return {
      公司名: dataJson.companyName || "",
      网站: dataJson.website || "",
      邮箱: dataJson.email || "",
      手机: dataJson.phone || "",
    };
  });
  // PaChongData
  // 2. 将数据转换为工作表
  const worksheet = utils.json_to_sheet(data);

  // 3. 创建一个新的工作簿
  const workbook: WorkBook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 4. 导出 Excel 文件为 Buffer
  const excelBuffer = write(workbook, { type: "buffer", bookType: "xlsx" });

  // 5. 设置响应头并返回文件
  const response = new NextResponse(excelBuffer, {
    headers: {
      "Content-Disposition": "attachment; filename=export.xlsx",
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });

  return response;
}
