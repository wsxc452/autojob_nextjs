import { ResponseReturn } from "@/app/api/common/common";
import { ApiUrl } from "@/base/base";
import { ListProps, SearchFormType } from "@/types";
import { Cards } from "@prisma/client";
const modelName = "search";
export const getList = async (
  page = 1,
  limit = 10,
  searchForm: SearchFormType,
): Promise<ResponseReturn<ListProps<Cards>>> => {
  const response = await fetch(`${ApiUrl}/${modelName}/list`, {
    cache: "no-cache",
    method: "POST",
    body: JSON.stringify({ page, limit, searchForm: searchForm || {} }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ResponseReturn = await response.json();
  return data;
};
export const getItem = async (
  id: number = 1,
): Promise<{ data: Cards; status: number }> => {
  const response = await fetch(`${ApiUrl}/${modelName}/${id}`, {
    cache: "no-cache",
  });

  // console.log("====get", response);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
export const updateItem = async (
  id: number = 1,
  updatedData: Partial<Cards>,
): Promise<Cards> => {
  const response = await fetch(`${ApiUrl}/${modelName}/${id}`, {
    cache: "no-cache",
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
export const deleteItem = async (id: number = 1): Promise<Cards> => {
  const response = await fetch(`${ApiUrl}/${modelName}/${id}`, {
    cache: "no-cache",
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
  updatedData: Partial<Cards>,
): Promise<Cards> => {
  console.log("createItem", updatedData);
  const response = await fetch(`${ApiUrl}/${modelName}`, {
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
