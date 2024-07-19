// 测试用例
const testCases: [string, string, boolean][] = [
  // 正确的包含关系
  ["15-20K", "8-200K", true],
  ["30-50K", "20-30K", true],
  ["30K+", "25-30K", true],
  ["8-12K", "0-8K", true],
  ["22000-25000", "20-25K", true],
  ["20K-30K", "20-30K", true],
  ["20-30K", "20000-30000", true],
  ["0-0K", "0-0K", true], // 不限制与自身匹配
  ["0-8K", "0-8K", true],
  ["8-12K", "8-12K", true],
  ["12-18K", "12-18K", true],
  ["18K-22K", "18K-22K", true],
  ["25K-30K", "25K-30K", true],
  ["30K+", "30K+", true],
  ["10000-22000", "10000-22000", true],

  // 不正确的包含关系
  ["30-50K", "20-25K", false],
  ["20K-30K", "20000-25000", false],
  ["30K+", "25-28K", false],
  ["8-12K", "10-18K", false],
  ["22000-25000", "22L-25K", false], // 无效的格式
  ["0-8K", "10-18K", false],

  // 边界情况
  ["0-0K", "8-12K", false], // 不限制与其他范围比较
  ["30K+", "25K-30K", true], // 范围末尾为无限大与具体范围的比较
  ["30K+", "10000-22000", true],
  ["10000-22000", "30K+", false], // 具体范围与范围末尾为无限大的比较
];

const testCasesNum: [string, number[]][] = [
  // 正确的包含关系
  ["8-200K", [8000, 200000]],
  ["15K-20K", [15000, 20000]],
  // 边界情况
  ["0-0K", [0, 0]], // 不限制与其他范围比较
  ["30K+", [30000, Infinity]], // 范围末尾为无限大与具体范围的比较
  ["30+", [30, Infinity]],
  ["10000-22000", [10000, 22000]], // 具体范围与范围末尾为无限大的比较
  ["10-22000", [10, 22000]],
  ["10-22K", [10000, 22000]],
];

const testCasesNumNotIgnoreK: [string, number[]][] = [
  // 正确的包含关系
  ["15-20K", [15, 20000]],
  ["15K-20K", [15000, 20000]],
  // 边界情况
  ["0-0K", [0, 0]], // 不限制与其他范围比较
  ["30K+", [30000, Infinity]], // 范围末尾为无限大与具体范围的比较
  ["30+", [30, Infinity]],
  ["10000-22000", [10000, 22000]], // 具体范围与范围末尾为无限大的比较
  ["10-22000", [10, 22000]],
  ["10-22K", [10, 22000]],
];

// 执行测试用例并输出测试报告
testCasesNum.forEach(([keyword1, expected]) => {
  const result = transformNum(keyword1, true);
  const isPass = result[0] === expected[0] && result[1] === expected[1];
  console.log(
    `[${isPass ? "PASS" : "FAIL"}] ${keyword1}  : Expected ${expected}, Got ${result}`,
  );
});
console.log("=================");
// 执行测试用例并输出测试报告
testCasesNumNotIgnoreK.forEach(([keyword1, expected]) => {
  const result = transformNum(keyword1, false);
  const isPass = result[0] === expected[0] && result[1] === expected[1];
  console.log(
    `[${isPass ? "PASS" : "FAIL"}] ${keyword1}  : Expected ${expected}, Got ${result}`,
  );
});
// console.log(transformNum("15-20K"));
// console.log(transformNum("15K-20K"));
// console.log(transformNum("15-20"));
// console.log(transformNum("15K-20"));
// console.log(transformNum("15K+"));
// console.log(transformNum("15+"));
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

  const spliceK = keyword.split("-");

  if (isFirstKIgnoreCase) {
    if (!spliceK[0].includes("K") && spliceK[1].includes("K")) {
      spliceK[0] = spliceK[0] + "K";
    }
    // if ignore first K, then minnum should plus 1000
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
  const [min1, max1] = transformNum(keyword1);
  const [min2, max2] = transformNum(keyword2);

  // 判断是否存在交集
  return min1 <= max2 && max1 >= min2;
}
// 测试用例
const testCases3: [string, string, boolean][] = [
  // 正确的包含关系
  ["15-20K", "10-18K", true],
  ["30-50K", "20-30K", true],
  ["30K+", "25-30K", true],
  ["8-12K", "0-8K", true],
  ["22000-25000", "20-25K", true],
  ["20K-30K", "20-30K", true],
  ["20-30K", "20000-30000", true],
  ["0-0K", "0-0K", true], // 不限制与自身匹配
  ["0-8K", "0-8K", true],
  ["8-12K", "8-12K", true],
  ["12-18K", "12-18K", true],
  ["18K-22K", "18K-22K", true],
  ["25K-30K", "25K-30K", true],
  ["30K+", "30K+", true],
  ["10000-22000", "10000-22000", true],

  // 不正确的包含关系
  ["30-50K", "20-25K", false],
  ["20K-30K", "20000-25000", true],
  ["30K+", "25-28K", false],
  ["8-12K", "10-18K", true],
  ["22000-25000", "22-25K", true],
  ["0-8K", "10-18K", false],

  // 边界情况
  ["0-0K", "8-12K", false], // 不限制与其他范围比较
  ["30K+", "25K-30K", true], // 范围末尾为无限大与具体范围的比较
  ["30K+", "10000-22000", false],
  ["10000-22000", "30K+", false], // 具体范围与范围末尾为无限大的比较
];

// 执行测试用例并输出测试报告
testCases3.forEach(([keyword1, keyword2, expected]) => {
  const result = isIncludeSalary(keyword1, keyword2);
  console.log(
    `[${result === expected ? "PASS" : "FAIL"}] ${keyword1} vs ${keyword2}: Expected ${expected}, Got ${result}`,
  );
});
