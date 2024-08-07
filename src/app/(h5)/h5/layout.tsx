"use client";
import MessageCom from "@/app/pc/components/Message";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import LogoutButton from "./common/LogoutButton";
const queryClient = new QueryClient();
import "./index/page.css";
import HeadTabs from "./common/Tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="body-wrap page flex h-screen w-screen flex-col text-black">
      <QueryClientProvider client={queryClient}>
        <AntdRegistry>
          <header
            className="box-border flex h-[60px] w-screen flex-row justify-center
             overflow-hidden bg-white bg-opacity-10 p-3"
          >
            <div className="logo relative  h-[60px] w-full ">
              <div className="absolute bottom-[-3px]  left-2">
                <HeadTabs />
              </div>
            </div>
            <div className="user-info">
              <LogoutButton />
            </div>
          </header>
          <main className="box-content w-screen flex-1 overflow-y-auto overflow-x-hidden">
            {children}
            <MessageCom />
          </main>
        </AntdRegistry>
      </QueryClientProvider>
    </div>
  );
}
