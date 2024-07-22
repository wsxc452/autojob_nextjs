"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppBody from "./AppBody";
const queryClient = new QueryClient();
export default function AppWrap({ children }: { children: React.ReactNode }) {
  // const [colorMode, setColorMode] = useColorMode();
  // const pathname = usePathname();

  return (
    <div className="w-full">
      <QueryClientProvider client={queryClient}>
        <AntdRegistry>
          <AppBody>{children}</AppBody>
        </AntdRegistry>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </div>
  );
}
