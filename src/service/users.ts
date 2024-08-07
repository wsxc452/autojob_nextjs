import { ResponseReturn } from "@/app/api/common/common";
import { ApiUrl } from "@/base/base";
import prisma from "@/db";
import { ListProps, UpdateUserType, UserInfo } from "@/types";
import { Users } from "@prisma/client";
export const getLists = async (
  page = 1,
  limit = 10,
): Promise<ResponseReturn<ListProps<UserInfo>>> => {
  const response = await fetch(`${ApiUrl}/users?page=${page}&limit=${limit}`);
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

export const syncItem = async (
  updatedData: Partial<Users>,
): Promise<{ data: any; status: number }> => {
  const response = await fetch(`${ApiUrl}/syncuser`, {
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
export const updateItem = async (
  id: number = 1,
  updatedData: Partial<UserInfo>,
): Promise<UserInfo> => {
  const response = await fetch(`${ApiUrl}/user/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.assign(updatedData, { id })),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
export const delItem = async (id: number = 1): Promise<UserInfo> => {
  const response = await fetch(`${ApiUrl}/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
export const disableItem = async (id: number = 1): Promise<UserInfo> => {
  const response = await fetch(`${ApiUrl}/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const updateUser = async (
  updatedData: Partial<Users & { updateType: UpdateUserType }>,
  userId: string,
): Promise<{
  data: any;
  status: number;
}> => {
  const response = await fetch(`${ApiUrl}/update/${userId}`, {
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

export const updateBalanceItemCode = async (
  updatedData: Partial<UserInfo>,
): Promise<UserInfo> => {
  const response = await fetch(`${ApiUrl}/updateBalance`, {
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
export const publichCards = async (
  updatedData: Partial<UserInfo>,
): Promise<UserInfo> => {
  const response = await fetch(`${ApiUrl}/publishCards`, {
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

export const checkAdminOrThrow = async (userId: string): Promise<boolean> => {
  // 检测是否是管理员, 不是则返回错误
  if (!userId) {
    throw new Error("userId is null");
  }
  try {
    const userInfo = await prisma.users.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });

    if (!userInfo || userInfo.isSuperUser === false) {
      throw new Error("You are not a super user");
    }
  } catch (e) {
    throw new Error("can not find user");
  }
  return true;
};

export const redeemedCode = async (code: string): Promise<any> => {
  if (!/^[0-9A-Za-z]*$/.test(code)) {
    throw new Error("请输入正确的code");
  }
  const response = await fetch(`${ApiUrl}/users/redeemedCode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
