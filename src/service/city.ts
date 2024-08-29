import { ApiUrl } from "@/base/base";
import prisma from "@/db";
import cityData from "../service/citydata/boss";
import pinyin from "pinyin";
// const cityData = {
//   code: 0,
//   message: "Success",
//   zpData: {
//     cityGroup: [
//       {
//         firstChar: "A",
//         cityList: [
//           {
//             code: "101070300",
//             name: "鞍山",
//             cityCode: "0412",
//             regionCode: "0",
//           },
//           {
//             code: "101081200",
//             name: "阿拉善盟",
//             cityCode: "0483",
//             regionCode: "0",
//           },
//           {
//             code: "101110700",
//             name: "安康",
//             cityCode: "0915",
//             regionCode: "0",
//           },
//         ],
//       },
//     ],
//   },
// };
function getCityPinYin(cityName: string) {
  const pinyinArray = pinyin(cityName, {
    style: pinyin.STYLE_NORMAL, // 只获取首字母
    heteronym: false, // 是否启用多音字
  });
  return pinyinArray.join("-");
}

export const saveCity = async (): Promise<{ data: any; status: number }> => {
  const cityGroups = cityData.zpData.cityGroup;
  const citiesToInsert = [];
  for (const group of cityGroups) {
    const { firstChar, cityList } = group;

    for (const city of cityList) {
      const { code, name, cityCode, regionCode } = city;

      citiesToInsert.push({
        firstChar: firstChar,
        code: code.toString(),
        name: name,
        cityCode: cityCode.toString(),
        regionCode: regionCode.toString(),
        pinyin: getCityPinYin(name),
        from: "BOSS",
      });
    }
  }

  // 批量插入数据到数据库
  try {
    await prisma.city.createMany({
      data: citiesToInsert,
      skipDuplicates: true, // 如果需要跳过重复的记录
    });
    console.log("Cities have been added to the database.");
    return { data: cityData, status: 200 };
  } catch (error: any) {
    console.error(error);
    return { data: error.toString(), status: 500 };
  }
};

export const getCity = async (
  from?: string,
): Promise<{ data: any; status: number }> => {
  // const from = "BOSS";
  const response = await fetch(`${ApiUrl}/city/?from=${from || "BOSS"}`, {
    // cache: "no-cache",
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
