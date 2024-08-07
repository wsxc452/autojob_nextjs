"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppBody from "./AppBody";
const queryClient = new QueryClient();
import MessageCom from "@/app/pc/components/Message";

import { ClerkProvider } from "@clerk/nextjs";
import { zhCN } from "@clerk/localizations";
import DefaultLayout from "../components/Layouts/DefaultLayout";

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
  console.log("AppWrap");
  return (
    <ClerkProvider
      localization={zhCN}
      afterSignOutUrl="/sign-in"
      signInUrl="/sign-in"
    >
      <div className="page h-dvh w-full">
        <QueryClientProvider client={queryClient}>
          <AntdRegistry>
            <DefaultLayout>
              <AppBody>{children}</AppBody>
              <MessageCom />
            </DefaultLayout>
          </AntdRegistry>
          {/* 
            <DefaultLayout>
              <AppBody>{children}</AppBody>
              <MessageCom />
            </DefaultLayout>
          </AntdRegistry> */}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </div>
    </ClerkProvider>
  );
}
