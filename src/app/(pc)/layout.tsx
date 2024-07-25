import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import Loader from "@/components/common/Loader";
import { ClerkProvider } from "@clerk/nextjs";
import { zhCN } from "@clerk/localizations";
import { App, ConfigProvider } from "antd";
import AppWrap from "./clients/AppWrap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { userId }: { userId: string | null } = auth();
  // console.log("userId", userId);
  // if (userId) {
  //   // redirect("/h5/index");
  // }

  return (
    <html lang="en">
      <body suppressHydrationWarning={false}>
        <ClerkProvider localization={zhCN}>
          <AppWrap>{children}</AppWrap>
        </ClerkProvider>
      </body>
    </html>
  );
}
