"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "antd";

import Loader from "@/components/common/Loader";
import { useEffect, useState } from "react";
const queryClient = new QueryClient();
export default function AppWrap({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  // const pathname = usePathname();
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <AntdRegistry>
        <App className="h-100vh">
          <div className="w-full dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : children}
          </div>
        </App>
      </AntdRegistry>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
