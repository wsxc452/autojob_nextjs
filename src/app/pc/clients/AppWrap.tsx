"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppBody from "./AppBody";
const queryClient = new QueryClient();
import MessageCom from "@/app/pc/components/Message";
import DefaultLayout from "../components/Layouts/DefaultLayout";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import registerEvents from "../common/registerRenderer";
export default function AppWrap({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerEvents();
  }, []);
  const router = usePathname();

  const LayoutMemo = useMemo(() => {
    const isAuthPage = router.includes("/auth/");

    if (!isAuthPage) {
      return (
        <QueryClientProvider client={queryClient}>
          <AntdRegistry>
            <DefaultLayout>
              <AppBody>{children}</AppBody>
              <MessageCom />
            </DefaultLayout>
          </AntdRegistry>
        </QueryClientProvider>
      );
    } else {
      return <AppBody>{children}</AppBody>;
    }
  }, [router, children]);

  return <div className="page h-dvh w-full">{LayoutMemo}</div>;
}
