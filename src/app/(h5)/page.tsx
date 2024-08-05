import ECommerce from "@/app/pc/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/app/pc/components/Layouts/DefaultLayout";
import { useEffect } from "react";
import registerEvents from "./common/registerRenderer";
// import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Auto Post Resume-Czm",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Home({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();

  return (
    <>
      <h3>loading</h3>
      {children}
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      {/* <DefaultLayout>
        <ECommerce />
      </DefaultLayout> */}
    </>
  );
}
