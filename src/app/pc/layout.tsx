import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect } from "react";

import AppWrap from "./clients/AppWrap";
import { ClerkProvider } from "@clerk/nextjs";
import { zhCN } from "@clerk/localizations";
import { SIGN_IN } from "./auth/config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autojob自动投递BOSS",
  description: "自动投递BOSS助手",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClerkProvider
          localization={zhCN}
          afterSignOutUrl={SIGN_IN}
          signInUrl={SIGN_IN}
        >
          <AppWrap>{children}</AppWrap>
        </ClerkProvider>
      </body>
    </html>
  );
}
