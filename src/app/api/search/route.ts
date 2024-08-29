import prisma from "@/db";
import { Search } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { jsonReturn } from "../common/common";
import { error } from "console";
import { auth } from "@clerk/nextjs/server";

function transformSalary(input: string): string {
  return input.replace(/·\d+薪/, "");
}
const model = prisma.search;
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

// function isIncludeKeyword(company: string, filterKeywords: string[]) {
//   let isExits = false;
//   let keyword = "";
//   filterKeywords.forEach((item) => {
//     if (company.includes(item)) {
//       keyword = item;
//       isExits = true;
//     }
//   });
//   return { isExits, keyword };
// }
export type KeyWordsMap = {
  id: number;
  keyword: string;
};

export type CheckDescType = {
  positionExits: boolean; // 职位关键字是否存在
  positionKeywords: string[]; // 职位关键字命中
  filteredExits: boolean; // 过滤关键字是否存在
  filteredKeywords: string[]; // 过滤关键字命中
};

export type ItemTaskRet = {
  status: boolean;
  error?: string;
  checkRet?: CheckDescType;
};

function checkDesc(
  descText: string,
  positionKeywords: KeyWordsMap[],
  filteredKeywords: KeyWordsMap[],
): CheckDescType {
  const retInfo = {
    positionExits: false,
    positionKeywords: [],
    filteredExits: false,
    filteredKeywords: [],
  } as CheckDescType;

  const descTextLower = descText.toLowerCase();
  // 对比职位描述,是否符合要求,只要有一个关键字存在,则认为符合要求
  // 如果没有设置职位关键字,说明不检测职位关键字,直接投递
  if (positionKeywords.length === 0) {
    console.log("没有设置职位关键字,直接投递");
    retInfo.positionExits = true;
  } else {
    for (const keywordItem of positionKeywords) {
      if (descTextLower.includes(keywordItem.keyword.toLowerCase())) {
        retInfo.positionExits = true;
        retInfo.positionKeywords.push(keywordItem.keyword);
      }
    }
  }

  // 如果有一个过滤关键字存在,则不符合
  for (const keywordItem of filteredKeywords) {
    if (descTextLower.includes(keywordItem.keyword.toLowerCase())) {
      retInfo.filteredExits = true;
      retInfo.filteredKeywords.push(keywordItem.keyword);
    }
  }
  return retInfo;
}
type CheckRetType = {
  status: boolean;
  error?: string;
  code?: string;
  checkRet?: CheckDescType;
};
async function checkPostInfo(
  urlParams: any,
  userId: string,
): Promise<CheckRetType> {
  // const urlParams = new URLSearchParams(bodyText);
  const md5 = urlParams.md5 || "";
  const taskId = urlParams.taskId || "";
  const company = urlParams.company || "";
  const salary = urlParams.salary || "";
  const descText = urlParams.descText || "";
  const autoThreadNo = urlParams.autoThreadNo || "";
  if (
    md5 === "" ||
    taskId === "" ||
    descText === "" ||
    company === "" ||
    autoThreadNo === ""
  ) {
    console.error("参数不全", md5, taskId, descText, company);
    return {
      status: false,
      error: "参数不全",
      code: "10001",
    };
  }

  // 检查md5是否存在, 每个taskId只能投递一次,但是多个task不同享
  const searchInfo = await prisma.search.findFirst({
    where: {
      md5: md5,
      userId,
      taskId,
    },
  });

  console.log("=====md5", md5);
  console.log("searchInfo", searchInfo);

  if (searchInfo) {
    return {
      status: false,
      error: "数据已存在",
      code: "10002",
    };
  }

  let taskInfo;
  try {
    taskInfo = await prisma.tasks.findFirstOrThrow({
      where: {
        id: parseInt(taskId, 10),
        userId,
      },
      include: {
        filteredKeywords: {
          select: {
            id: true,
            keyword: true, // 仅选择需要的字段，例如 keyword
          },
        }, // 包含关联的 filteredKeywords 数据
        positionKeywords: {
          select: {
            id: true,
            keyword: true, // 仅选择需要的字段，例如 keyword
          },
        },
      },
    });
  } catch (err) {
    return { error: "找不到任务", code: "10003", status: false };
  }

  // 过滤掉某些公司
  //   const FilterCompony: taskInfo.filteredKeywords[] =
  //     filterKeywords.filteredKeywords;
  // 如果薪资在过滤列表中，则不保存
  if (salary != "" && taskInfo.salary != null) {
    if (!isIncludeSalary(salary, taskInfo.salary)) {
      return {
        status: false,
        error: `公司薪资范围 (${salary}) 与设置的条件 (${taskInfo.salary}) 不匹配`,
        code: "10005",
      };
    } else {
      console.log(
        `公司薪资范围 (${salary}) 与设置的条件 (${taskInfo.salary}) 匹配`,
      );
    }
  }
  console.log("checkRet====>descText", descText);
  console.log("checkRet====>1111", JSON.stringify(taskInfo.positionKeywords));
  console.log("checkRet====>1111", JSON.stringify(taskInfo.filteredKeywords));
  const checkRet = checkDesc(
    descText,
    taskInfo.positionKeywords,
    taskInfo.filteredKeywords,
  );
  console.log("checkRet====>222", JSON.stringify(checkRet));
  // 如果公司名称在过滤列表中，则不保存

  // 如果没有命中职位关键字,则不投递
  if (!checkRet.positionExits) {
    return {
      status: false,
      error: "没有命中职位关键字,不投递",
      code: "10004",
      checkRet,
    };
  }
  // 如果命中过滤关键字,则不投递
  if (checkRet.filteredExits) {
    return {
      status: false,
      error: "命中过滤关键字,不投递",
      code: "10006",
      checkRet,
    };
  }

  return { status: true, checkRet };
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<{ data: Search; status: number } | { error: string }>> {
  //   console.log("POST request", request);
  const { userId } = auth().protect();
  // const bodyText = await request.text();
  // 获取请求体
  // 将 URL 编码的字符串解析为对象
  const bodyParams = await request.json();
  // const urlParams = new URLSearchParams(bodyText);

  const checkPostRet = await checkPostInfo(bodyParams, userId);
  const costPoint = 1;
  console.log("checkPostRet", checkPostRet);
  const body: Omit<Search, "id" | "createdAt" | "updatedAt"> = {
    md5: bodyParams.md5 ?? "",
    position: bodyParams.position ?? "",
    salary: bodyParams.salary ?? "",
    company: bodyParams.company ?? "",
    scale: bodyParams.scale ?? "", // pc暂时没获取
    taskId: bodyParams.taskId,
    autoThreadNo: bodyParams.autoThreadNo,
    userId: userId,
    descText: bodyParams.descText ?? "",
    costPoint,
    // oid: urlParams.get("oid") ?? "",
    isCanPost: checkPostRet.status,
    whiteInfo: checkPostRet.checkRet?.positionKeywords.join(",") ?? "",
    blackInfo: checkPostRet.checkRet?.filteredKeywords.join(",") ?? "",
    errDesc: checkPostRet.error || "",
  };
  //   const body = JSON.parse(bodyText);
  try {
    // 使用 Prisma 更新任务数据
    const updatedTask = await prisma.search.create({
      data: body,
    });

    if (!checkPostRet.status) {
      return jsonReturn(
        { error: checkPostRet.error, code: checkPostRet.code },
        400,
      );
    }

    // 这里过了所有的检查,则可以投递
    // 扣除用户的积分
    const userPoints = await prisma.users.update({
      where: {
        userId: userId,
      },
      select: {
        points: true,
      },
      data: {
        points: {
          decrement: 1,
        },
      },
    });

    console.log("扣除用户积分后", userPoints);

    return jsonReturn({
      data: userPoints,
      checkPost: checkPostRet,
    });
  } catch (error: any) {
    // console.error(error);
    console.error(error.message + "====" + error.code);
    if (error.code === "P2002" || error.code === "P2003") {
      return jsonReturn(
        {
          error: "数据重复",
          code: "10002",
        },
        400,
      );
    }
    return jsonReturn({ error: error.message, code: error.code }, 400);
  }
}

export async function GET(request: NextRequest) {
  const { userId } = auth().protect();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;
  const [data, total] = await prisma.$transaction([
    model.findMany({
      skip: offset,
      take: limit,
      where: {
        userId,
      },
      orderBy: [
        {
          id: "desc", // 然后按 id 降序排列
        },
      ],
    }),
    model.count({
      where: {
        userId,
      },
    }),
  ]);
  return jsonReturn({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
