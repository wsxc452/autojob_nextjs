import { ResponseReturn } from "@/app/api/common/common";
import { ApiUrl } from "@/base/base";
import { ListProps, UserInfo } from "@/types";
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
): Promise<{ data: UserInfo; status: number }> => {
  const response = await fetch(`${ApiUrl}/user/${id}`, {
    cache: "no-cache",
  });

  console.log("====getList", response);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  //   console.log("getList", response.json());
  return response.json();
};

export const syncItem = async (updatedData: Partial<Users>): Promise<Users> => {
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
