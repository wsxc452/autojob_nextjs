import { electronAPI } from '@electron-toolkit/preload';
export type FilterCompony = {
  id: number;
  keyword: string;
};

export interface TaskItem {
  id: number;
  title: string;
  salary: string;
  position: [];
  staffnum: string;
  oid: string;
  filteredKeywords: Array<FilterCompony>;
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
    electron: typeof electronAPI
  }
}

