import { ResponseReturn } from "@/app/api/common/common";
import { ApiUrl } from "@/base/base";
import { ListProps, TaskItem } from "@/types";
export const getTaskList = async (
  page = 1,
  limit = 10,
): Promise<ResponseReturn<ListProps<TaskItem>>> => {
  const response = await fetch(`${ApiUrl}/tasks?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ResponseReturn = await response.json();
  return data;
};
export const getTask = async (
  id: number = 1,
): Promise<{ data: TaskItem; status: number }> => {
  const response = await fetch(`${ApiUrl}/task/${id}`, {
    cache: "no-cache",
  });

  console.log("====getTask", response);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  //   console.log("getTask", response.json());
  return response.json();
};
export const updateTask = async (
  id: number = 1,
  updatedData: Partial<TaskItem>,
): Promise<TaskItem> => {
  const response = await fetch(`${ApiUrl}/task/${id}`, {
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
export const deleteTask = async (id: number = 1): Promise<TaskItem> => {
  const response = await fetch(`${ApiUrl}/task/${id}`, {
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

export const createTask = async (
  updatedData: Partial<TaskItem>,
): Promise<TaskItem> => {
  const response = await fetch(`${ApiUrl}/task`, {
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
