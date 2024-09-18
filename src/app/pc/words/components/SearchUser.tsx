"use client";
import React, { useMemo, useRef, useState } from "react";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import type { SelectProps } from "antd";
import { ApiUrl } from "@/base/base";
import { Users } from "@prisma/client";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

// Usage of DebounceSelect
interface UserValue {
  label: string;
  value: string;
}

async function fetchUserList(username: string): Promise<UserValue[]> {
  console.log("fetching user", username);
  username = username.trim();
  if (username.length === 0) {
    return [];
  }

  return fetch(`${ApiUrl}/users/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
    body: JSON.stringify({ email: username }),
  })
    .then((response) => response.json())
    .then((body) =>
      body.data.data.map((item: Users) => ({
        label: `${item.email}`,
        title: `${item.userId}`,
        value: JSON.stringify({
          email: item.email,
          id: item.id,
          userId: item.userId,
        }),
      })),
    );
}

type SearchProps = {
  onSelect: (val: JSON | null) => void;
};
const SearchUserSelect = ({ onSelect }: SearchProps) => {
  //   const [value, setValue] = useState<UserValue[]>([]);
  return (
    <DebounceSelect
      allowClear
      placeholder="请输入要搜索推荐人邮箱关键词"
      fetchOptions={fetchUserList}
      style={{ width: 268 }}
      onChange={(newValue: any) => {
        // console.log("onChange", newValue);
        // setValue(newValue as UserValue[]);
        if (newValue) {
          onSelect(JSON.parse(newValue.value as string));
        } else {
          onSelect(null);
        }
      }}
    />
  );
};

export default SearchUserSelect;
