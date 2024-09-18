import { ResponseReturn } from "@/app/api/common/common";
import { ApiUrl } from "@/base/base";
import { CardPublishFormValuesType, ListProps } from "@/types";
import { CardTypes } from "@prisma/client";

const modelName = "words";

export const getList = async (
  page = 1,
  limit = 10,
  searchForm: any,
): Promise<ResponseReturn<ListProps<CardTypes>>> => {
  const response = await fetch(`${ApiUrl}/${modelName}/list`, {
    cache: "no-cache",
    method: "POST",
    body: JSON.stringify({ page, limit, searchForm: searchForm || {} }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const retData = await response.json();
  if (retData.status !== 200) {
    throw new Error(retData.data.error || "error");
  }
  return retData;
};
export const getItem = async (
  id: string,
): Promise<{ data: CardTypes; status: number }> => {
  const response = await fetch(`${ApiUrl}/${modelName}/${id}`, {
    cache: "no-cache",
  });

  console.log("====get", response);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const retData = await response.json();
  if (retData.status !== 200) {
    throw new Error(retData.data.error || "error");
  }
  return retData;
};
export const updateItem = async (
  id: number = 1,
  updatedData: Partial<CardTypes>,
): Promise<CardTypes> => {
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
  const retData = await response.json();
  if (retData.status !== 200) {
    throw new Error(retData.data.error || "error");
  }
  return retData;
};
export const deleteItem = async (id: number = 1): Promise<CardTypes> => {
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
  const retData = await response.json();
  if (retData.status !== 200) {
    throw new Error(retData.data.error || "error");
  }
  return retData;
};

export const createItem = async (
  updatedData: Partial<CardTypes>,
): Promise<CardTypes> => {
  console.log("createItem", updatedData);
  const response = await fetch(`${ApiUrl}/${modelName}/add`, {
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
  const retData = await response.json();
  if (retData.status !== 200) {
    throw new Error(retData.data.error || "error");
  }
  return retData;
};

export const publishCards = async (
  updatedData: Partial<CardPublishFormValuesType>,
): Promise<{
  data: { count?: number; error?: string };
  status: number;
}> => {
  console.log("createItem", updatedData);
  const response = await fetch(`${ApiUrl}/${modelName}/publishCards`, {
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
  const retData = await response.json();
  if (retData.status !== 200) {
    throw new Error(retData.data.error || "error");
  }
  return retData;
};
