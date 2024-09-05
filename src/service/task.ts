import { ResponseReturn } from "@/app/api/common/common";
import { ApiUrl } from "@/base/base";
import { ListProps, TaskItem } from "@/types";
import { Users } from "@prisma/client";
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
  isWithGreeting: boolean = false,
): Promise<{ data: TaskItem; status: number }> => {
  const response = await fetch(
    `${ApiUrl}/task/${id}?isWithGreeting=${isWithGreeting}`,
    {
      cache: "no-cache",
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const getTaskInfos = async (
  id: number = 1,
): Promise<{
  data: {
    userInfo: Users & { greetings: [] };
    taskInfo: TaskItem;
  };
  status: number;
}> => {
  //api/task/infos?id=10
  const response = await fetch(`${ApiUrl}/task/infos?id=${id}`, {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
export const updateTask = async (
  id: number = 1,
  updatedData: Partial<TaskItem>,
): Promise<{
  status: number;
  data: any;
}> => {
  console.log("updatedData", updatedData);
  const response = await fetch(`${ApiUrl}/task/${id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.assign(updatedData)),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
export const deleteTask = async (
  id: number = 1,
): Promise<{ status: number; data: any }> => {
  const response = await fetch(`${ApiUrl}/task/${id}`, {
    method: "DELETE",
    cache: "no-cache",
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
): Promise<{
  status: number;
  data: any;
}> => {
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
