import { ResponseReturn } from "@/app/api/common/common";
import { ApiUrl } from "@/base/base";
import { ListProps } from "@/types";

const modelName = "PTask";

export const getList = async (
  page = 1,
  limit = 10,
  searchForm: any,
): Promise<ResponseReturn<ListProps<any>>> => {
  const response = await fetch(`${ApiUrl}/pachong/list`, {
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

export const pachongCreate = async (
  url: string,
  desc: string = "",
): Promise<any> => {
  url = url.trim();

  const response = await fetch(`${ApiUrl}/pachong/createTask`, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      desc,
    }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
