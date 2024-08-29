import { NextRequest } from "next/server";
import { jsonReturn } from "../common/common";
import crypto from "crypto";

function getMd5(str: string) {
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
}
function extractThreeDigitsFromMD5(arg1: string, arg2: string, arg3: string) {
  // 将参数转换为MD5哈希
  const hash1 = getMd5(arg1);
  const hash2 = getMd5(arg2);
  const hash3 = getMd5(arg3);

  // 提取每个哈希的前三个数字
  const extractDigits = (hash: string) => {
    const digits = hash.match(/\d/g); // 提取所有数字
    if (digits && digits.length >= 3) {
      return digits.slice(0, 3).join(""); // 返回前三个数字
    }
    return "888"; // 如果不够三个数字，补位为888
  };

  const num1 = extractDigits(hash1);
  const num2 = extractDigits(hash2);
  const num3 = extractDigits(hash3);

  return [parseInt(num1), parseInt(num2), parseInt(num3)];
}

export async function GET(request: NextRequest, context: {}) {
  const url = new URL(request.url);
  const [num1, num2, num3] = extractThreeDigitsFromMD5(
    "19891106",
    "20240824",
    "阿里巴巴",
  );
  return jsonReturn({
    num1: 985,
    num2: 211,
    num3: 116,
    text: "今天面试会顺利吗?",
  });
}
