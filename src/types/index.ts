import { electronAPI } from "@electron-toolkit/preload";
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
  salary: string;
  // position: [];
  staffnum: string;
  userId: string;
  filteredKeywords: Array<FilterCompony>;
  positionKeywords: Array<FilterPosition>;
  greetings: Array<GreetingItem>;
}

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
