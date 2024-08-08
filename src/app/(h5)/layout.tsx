import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { auth } from "@clerk/nextjs/server";

import { ClerkProvider } from "@clerk/nextjs";
import { zhCN } from "@clerk/localizations";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId }: { userId: string | null } = auth();
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClerkProvider
          afterSignOutUrl="/h5/login"
          signInUrl="/h5/login"
          localization={zhCN}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
