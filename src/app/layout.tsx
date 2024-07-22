import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";

import { ClerkProvider } from "@clerk/nextjs";
import AppWrap from "@/app/clients/AppWrap";
import { zhCN } from "@clerk/localizations";

// Create a client
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={zhCN}>
      <html lang="zh">
        <body suppressHydrationWarning={true}>
          <AppWrap>{children}</AppWrap>
        </body>
      </html>
    </ClerkProvider>
  );
}
