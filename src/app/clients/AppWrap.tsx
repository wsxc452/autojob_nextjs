"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppBody from "./AppBody";
const queryClient = new QueryClient();
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import globaStore, { userActions } from "@/states/globaStore";
import MessageCom from "@/components/Message";

export default function AppWrap({ children }: { children: React.ReactNode }) {
  // const [colorMode, setColorMode] = useColorMode();
  // const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      userActions.setUserInfo({
        name: user?.fullName || "",
        email: user?.emailAddresses[0]?.emailAddress || "",
        avatar: user?.imageUrl || "",
        id: user?.id || "",
      });
      console.log(globaStore.userInfo);
    }
  }, [user]);
  return (
    <div className="w-full">
      <QueryClientProvider client={queryClient}>
        <AntdRegistry>
          <AppBody>{children}</AppBody>
          <MessageCom />
        </AntdRegistry>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </div>
  );
}
