import { ResponseReturn } from "@/app/api/common/common";
import { getChinaTime } from "@/app/pc/common/util";
import { ApiUrl } from "@/base/base";
import prisma from "@/db";
import { ListProps, UpdateUserType, UserInfo } from "@/types";
import { Users } from "@prisma/client";
export const getLists = async (
  page = 1,
  limit = 10,
  searchForm?: any,
): Promise<ResponseReturn<ListProps<UserInfo>>> => {
  const response = await fetch(`${ApiUrl}/users?page=${page}&limit=${limit}`, {
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ResponseReturn = await response.json();
  return data;
};
export const getItem = async (
  id: number = 1,
): Promise<{ data: Users; status: number }> => {
  const response = await fetch(`${ApiUrl}/user/${id}`, {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  //   console.log("getList", response.json());
  return response.json();
};
export const getItemByUserId = async (
  userId: string,
): Promise<{ data: Users; status: number }> => {
  console.log("getItemByUserId===>", userId);
  const response = await fetch(`${ApiUrl}/users/get`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  //   console.log("getList", response.json());
  return response.json();
};
export const syncItem = async (
  updatedData: Partial<Users>,
): Promise<{ data: any; status: number }> => {
  const response = await fetch(`${ApiUrl}/syncuser`, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
// export const updateItem = async (
//   id: number = 1,
//   updatedData: Partial<UserInfo>,
// ): Promise<UserInfo> => {
//   const response = await fetch(`${ApiUrl}/user/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(Object.assign(updatedData, { id })),
//   });
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   return response.json();
// };
// export const delItem = async (id: number = 1): Promise<UserInfo> => {
//   const response = await fetch(`${ApiUrl}/user/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ id }),
//   });
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   return response.json();
// };
// export const disableItem = async (id: number = 1): Promise<UserInfo> => {
//   const response = await fetch(`${ApiUrl}/user/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ id }),
//   });
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   return response.json();
// };

export const updateUser = async (
  updatedData: Partial<Users & { updateType: UpdateUserType }>,
  userId: string,
): Promise<{
  data: any;
  status: number;
}> => {
  const response = await fetch(`${ApiUrl}/update/${userId}`, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const createItem = async (
  updatedData: Partial<UserInfo>,
): Promise<UserInfo> => {
  const response = await fetch(`${ApiUrl}/user`, {
    cache: "no-cache",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const publichCards = async (
  updatedData: Partial<UserInfo>,
): Promise<UserInfo> => {
  const response = await fetch(`${ApiUrl}/publishCards`, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const checkAdminOrThrow = async (userId: string): Promise<void> => {
  // 检测是否是管理员, 不是则返回错误
  if (!userId) {
    throw new Error("userId is null");
  }
  try {
    const userInfo = await prisma.users.findFirstOrThrow({
      where: {
        userId: userId,
        isSuperUser: true,
      },
    });
  } catch (e) {
    throw new Error("非管理员账号");
  }
  // return true;
};

export const redeemedCode = async (
  code: string,
  redeemedBy: string,
): Promise<any> => {
  // 如果code不是C8开头,则不是兑换码
  code = code.trim().toUpperCase();
  if (!code.startsWith("C8")) {
    throw new Error("请输入正确的code,C8开头");
  }
  if (!/^[0-9A-Za-z]*$/.test(code)) {
    throw new Error("请输入正确的code");
  }
  const response = await fetch(`${ApiUrl}/users/redeemedCode`, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      redeemedBy,
    }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const wordCode = async (
  code: string,
  redeemedBy: string,
): Promise<any> => {
  code = code.trim().toUpperCase();
  // 如果是口令兑换,则需要检查是否是口令,字符串长度>4
  if (code.length <= 4 || code.trim().length > 20) {
    throw new Error("请输入正确的code");
  }

  const response = await fetch(`${ApiUrl}/users/wordCode`, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      redeemedBy,
    }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
// type UserInfoAccount = {
//   points: number;
//   cardStartTime: Date;
//   cardEndTime: Date;
// };
// export const checkUserAccount = (userInfo: UserInfoAccount) => {
//   // first check user is Has cardEndTime
//   let msg = "";
//   if (!userInfo.cardEndTime) {
//     // check is has points
//     if (userInfo.points <= 0) {
//       msg = "用户余额不足";
//       return {
//         status: false,
//         msg: "用户余额不足",
//       };
//     } else {
//       msg = `用户余额: ${userInfo.points}`;
//     }
//   } else {
//     // check cardEndTime is valid
//     const hasTimeLeft = dayjs(userInfo.cardEndTime).isAfter(dayjs());
//     if (!hasTimeLeft) {
//       // check is has points
//       console.log("用户卡密已过期,check userInfo.points", userInfo.points);
//       if (userInfo.points <= 0) {
//         return {
//           status: false,
//           msg: "用户余额不足",
//         };
//       } else {
//         msg = `用户卡密已过期,用户余额: ${userInfo.points}`;
//       }
//     } else {
//       msg = `用户卡密有效期: ${getChinaTime(userInfo.cardEndTime)}`;
//     }
//   }
//   console.log("checkUserAccount", userInfo);
//   return {
//     status: true,
//     points: userInfo.points,
//     cardEndTime: userInfo.cardEndTime,
//     msg,
//   };
// };
