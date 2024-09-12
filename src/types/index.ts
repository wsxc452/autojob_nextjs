import { electronAPI } from "@electron-toolkit/preload";
import { Dayjs } from "dayjs";
export type FilterCompony = {
  id: number;
  keyword: string;
};
export type FilterPosition = {
  id: number;
  keyword: string;
};
type GreetingItem = {
  id: number;
  content: string;
};
export interface TaskItem {
  id: number;
  title: string;
  salary?: string;
  // position: [];
  staffnum: string;
  userId: string;
  filteredKeywords: Array<FilterCompony>;
  positionKeywords: Array<FilterPosition>;
  passCompanys: Array<FilterPosition>;
  // greetings: Array<GreetingItem>;
  maxCount: number;
  searchText: string;
  isIgnorePassed?: boolean;
  cityCode: string;
  cityName: string;
  activeCheck: boolean;
  bossOnlineCheck: boolean;
  headhunterCheck: boolean;
  experienceValue: string; // 经验要求
  degreeValue: string; // 学历要求
  salaryValue: string; // 薪资要求
  scaleValue: string; // 公司规模要求
  greetingGroupId: number | null;
  GreetingGroup?: [];
  greetings?: [];
  search?: [];
  createdAt?: string;
  updatedAt?: string;
}
// Define a type with the modified properties
export type TaskItemForm = Omit<
  TaskItem,
  "experienceValue" | "degreeValue" | "salaryValue" | "scaleValue" | "salary"
> & {
  salary: {
    minMoney: string;
    maxMoney: string;
  };
  experienceValue: string[]; // 经验要求
  degreeValue: string[]; // 学历要求
  salaryValue: string; // 薪资要求 (optional if not needed in the form)
  scaleValue: string[]; // 公司规模要求
};
export interface ListProps<T> {
  data: Array<T>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserInfo {
  id: string;
  name?: string;
  email: string;
  avatar: string;
  role?: string;
  status?: string;
  oid?: string;
}
declare global {
  interface Window {
    electron: typeof electronAPI;
  }
}

export type CardPublishFormValuesType = {
  id: number;
  pubNum: number;
};

export enum UpdateUserType {
  Disable,
  IncreasePoint,
}

export type ReturnData<T = any> = {
  data: T | { error: string };
  status: number;
};

export type SearchFormType = {
  time_range: Dayjs[];
};
