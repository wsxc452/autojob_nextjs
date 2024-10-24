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
