import "server-only";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";

import AppWrap from "@/clients/AppWrap";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

// Create a client
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  console.log("params", session);
  // check router , if user is not logged in and page is not in the /auth/* path, redirect to /auth/signin
  // if (!session) {
  //   return <h1>尚未登陆</h1>;
  // }
  console.log("session.....RootLayout", session);
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SessionProvider session={session}>
          <AppWrap>{children}</AppWrap>
        </SessionProvider>
      </body>
    </html>
  );
}
