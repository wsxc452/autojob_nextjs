"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppBody from "./AppBody";
const queryClient = new QueryClient();
import MessageCom from "@/app/pc/components/Message";

import { ClerkProvider } from "@clerk/nextjs";
import { zhCN } from "@clerk/localizations";

export default function AppWrap({ children }: { children: React.ReactNode }) {
  // const [colorMode, setColorMode] = useColorMode();
  // const pathname = usePathname();
  // const { user } = useUser();

  // useEffect(() => {
  //   if (user) {
  //     userActions.setUserInfo({
  //       name: user?.fullName || "",
  //       email: user?.emailAddresses[0]?.emailAddress || "",
  //       avatar: user?.imageUrl || "",
  //       id: user?.id || "",
  //     });
  //     console.log(globaStore.userInfo);
  //   }
  // }, [user]);
  return (
    <ClerkProvider localization={zhCN}>
      <div className="h-dvh w-full">
        <QueryClientProvider client={queryClient}>
          <AntdRegistry>
            <AppBody>{children}</AppBody>
            <MessageCom />
          </AntdRegistry>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </div>
    </ClerkProvider>
  );
}