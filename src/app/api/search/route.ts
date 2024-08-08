import prisma from "@/db";
import { Search } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { jsonReturn } from "../common/common";

function transformSalary(input: string): string {
  return input.replace(/·\d+薪/, "");
}

/**
 *
 * @param keyword [15-20K] => [15000, 20000] [30K+] => [30000, Infinity] [30+] => [30, Infinity] [15K-20K] => [15000, 20000]
 * @param isFirstKIgnoreCase 是否忽略第一个K,如果为true,则[15-20K] => [15000, 20000] [15K-20K] => [15000, 20000],如果为false,则[15-20K] => [15, 20000] [15K-20K] => [15000, 20000]
 * @returns
 */
function transformNum(
  keyword: string,
  isFirstKIgnoreCase = true,
): [number, number] {
  // 如果第一个字母存在K,则将K替换为空
  let min = 0;
  let max = 0;

  if (keyword.includes("+")) {
    // 30K+ => [30000, Infinity]
    // 30+ => [30, Infinity]
    const min =
      parseInt(keyword.replace(/[^\d]/g, ""), 10) *
      (keyword.includes("K") ? 1000 : 1);
    return [min, Infinity];
  }
  // 15-25K,8-200k
  const spliceK = keyword.split("-");
  spliceK[1] = transformSalary(spliceK[1]);
  if (isFirstKIgnoreCase) {
    if (!spliceK[0].includes("K") && spliceK[1].includes("K")) {
      spliceK[0] = spliceK[0] + "K";
    }
    // if ignore first K, then minnum should plus 1000
    console.log("===== spliceK[0]includes", spliceK[0].includes("K"));
    min =
      parseInt(spliceK[0].replace(/[^\d]/g, ""), 10) *
      (spliceK[0].includes("K") ? 1000 : 1);
    max =
      parseInt(spliceK[1].replace(/[^\d]/g, ""), 10) *
      (spliceK[1].includes("K") ? 1000 : 1);
  } else {
    min =
      parseInt(spliceK[0].replace(/[^\d]/g, ""), 10) *
      (spliceK[0].includes("K") ? 1000 : 1);
    // if splicek[1] has K, then maxnum should plus 1000
    if (!spliceK[1].includes("K") && !spliceK[0].includes("K")) {
      max = parseInt(spliceK[1].replace(/[^\d]/g, ""), 10) * 1;
    } else {
      max = parseInt(spliceK[1].replace(/[^\d]/g, ""), 10) * 1000;
    }
  }

  return [min, max];
}

function isIncludeSalary(keyword1: string, keyword2: string): boolean {
  const [min1, max1] = transformNum(keyword1, true);
  const [min2, max2] = transformNum(keyword2, true);
  console.log("min1", min1, "max1", max1, "min2", min2, "max2", max2);
  // 判断是否存在交集
  return min1 <= max2 && max1 >= min2;
}

function isIncludeKeyword(company: string, filterKeywords: string[]) {
  let isExits = false;
  let keyword = "";
  filterKeywords.forEach((item) => {
    if (company.includes(item)) {
      keyword = item;
      isExits = true;
    }
  });
  return { isExits, keyword };
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<{ data: Search; status: number } | { error: string }>> {
  //   console.log("POST request", request);
  const bodyText = await request.text();
  console.log("POST request", bodyText);
  // 获取请求体
  // 将 URL 编码的字符串解析为对象
  const urlParams = new URLSearchParams(bodyText);
  const md5 = urlParams.get("md5");
  const taskId = urlParams.get("taskId");
  const company = urlParams.get("company") || "";
  const salary = urlParams.get("salary") || "";
  console.log(urlParams);
  if (
    md5 === null ||
    md5 === undefined ||
    md5 === "" ||
    taskId === null ||
    taskId === undefined ||
    taskId === ""
  ) {
    return jsonReturn(
      {
        message: "参数不全",
        code: "10001",
      },
      400,
    );
  }
  let taskInfo;
  try {
    taskInfo = await prisma.tasks.findFirstOrThrow({
      where: {
        id: parseInt(taskId, 10),
      },
      include: {
        filteredKeywords: {
          select: {
            id: true,
            keyword: true, // 仅选择需要的字段，例如 keyword
          },
        }, // 包含关联的 filteredKeywords 数据
      },
    });
  } catch (err) {
    return jsonReturn(
      {
        message: "找不到任务",
        code: "10003",
      },
      400,
    );
  }

  // 过滤掉某些公司
  //   const FilterCompony: taskInfo.filteredKeywords[] =
  //     filterKeywords.filteredKeywords;
  // 如果薪资在过滤列表中，则不保存
  if (salary != "" && taskInfo.salary != null) {
    if (!isIncludeSalary(salary, taskInfo.salary)) {
      return jsonReturn(
        {
          message: `公司薪资范围 (${salary}) 与设置的条件 (${taskInfo.salary}) 不匹配`,
          code: "10005",
        },
        400,
      );
    }
  }

  const filterKeywords = taskInfo!.filteredKeywords.map((item) => {
    return item.keyword;
  });

  console.log("filterKeywords", filterKeywords, filterKeywords);
  // 如果公司名称在过滤列表中，则不保存
  if (company != "") {
    const { isExits, keyword } = isIncludeKeyword(company, filterKeywords);
    if (isExits) {
      return jsonReturn(
        {
          message: `(${keyword})在过滤列表中`,
          code: "10004",
        },
        400,
      );
    }
  }
  const isCanPost = urlParams.get("isCanPost") === "True" ? true : false;
  const body: Omit<Search, "id" | "createdAt" | "updatedAt"> = {
    md5: urlParams.get("md5") ?? "",
    position: urlParams.get("position") ?? "",
    salary: urlParams.get("salary") ?? "",
    company: urlParams.get("company") ?? "",
    scale: urlParams.get("scale") ?? "",
    taskId: parseInt(urlParams.get("taskId") ?? "0", 10),
    autoThreadNo: urlParams.get("autoThreadNo") ?? "0",
    userId: urlParams.get("userId") ?? "",
    // oid: urlParams.get("oid") ?? "",
    isCanPost: isCanPost,
    whiteInfo: urlParams.get("whiteInfo") ?? "",
    blackInfo: urlParams.get("blackInfo") ?? "",
    errDesc: urlParams.get("errDesc") ?? "",
  };
  //   const body = JSON.parse(bodyText);
  try {
    // 使用 Prisma 更新任务数据
    const updatedTask = await prisma.search.create({
      data: body,
    });

    return NextResponse.json({
      data: updatedTask,
      status: 200,
    });
  } catch (error: any) {
    console.error(error.message + "====" + error.code);
    if (error.code === "P2002") {
      return jsonReturn(
        {
          message: "数据重复",
          code: "10002",
        },
        400,
      );
    }
    return jsonReturn({ message: error.message, code: error.code }, 500);
  }
}
export async function GET(request: NextRequest) {
  const types = prisma.tasks.fields;
  console.log("types", types);
  return NextResponse.json({ msg: "11" });
}
