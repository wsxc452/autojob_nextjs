import "server-only";
import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignOut from "@/actions/signOut";
import { SessionProvider } from "next-auth/react";
export const metadata: Metadata = {
  title: "Auto Post Resume-Czm",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Home() {
  const session = await auth();
  console.log("session.....Home", session);
  if (!session) {
    redirect("/api/auth/signin");
    // await signOut({
    //   redirectTo: "/api/auth/signin",
    // });
    return <h1>尚未登陆</h1>;
  }
  return (
    <>
      <SessionProvider session={session}>
        <DefaultLayout>
          <SignOut />
          <ECommerce />
        </DefaultLayout>
      </SessionProvider>
    </>
  );
}
