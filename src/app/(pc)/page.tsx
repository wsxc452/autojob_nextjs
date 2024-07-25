import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Auto Post Resume-Czm",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Home({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <h3>loading</h3>
      {children}
    </>
  );
}
