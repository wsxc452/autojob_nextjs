import { ResponseReturn } from "@/app/api/common/common";
import { ApiUrl } from "@/base/base";
import { CardPublishFormValuesType, ListProps } from "@/types";
import { CardTypes } from "@prisma/client";
const modelName = "cardTypes";
export const getList = async (
  page = 1,
  limit = 10,
): Promise<ResponseReturn<ListProps<CardTypes>>> => {
  const response = await fetch(
    `${ApiUrl}/${modelName}?page=${page}&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ResponseReturn = await response.json();
  return data;
};
export const getItem = async (
  id: number = 1,
): Promise<{ data: CardTypes; status: number }> => {
  const response = await fetch(`${ApiUrl}/${modelName}/${id}`, {
    cache: "no-cache",
  });

  console.log("====get", response);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
export const updateItem = async (
  id: number = 1,
  updatedData: Partial<CardTypes>,
): Promise<CardTypes> => {
  const response = await fetch(`${ApiUrl}/${modelName}/${id}`, {
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
export const deleteItem = async (id: number = 1): Promise<CardTypes> => {
  const response = await fetch(`${ApiUrl}/${modelName}/${id}`, {
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
  updatedData: Partial<CardTypes>,
): Promise<CardTypes> => {
  console.log("createItem", updatedData);
  const response = await fetch(`${ApiUrl}/${modelName}`, {
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

export const publishCards = async (
  updatedData: Partial<CardPublishFormValuesType>,
): Promise<{
  data: { count?: number; error?: string };
  status: number;
}> => {
  console.log("createItem", updatedData);
  const response = await fetch(`${ApiUrl}/${modelName}/publishCards`, {
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
