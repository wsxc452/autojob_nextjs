import ECommerce from "@/app/pc/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/app/pc/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Auto Post Resume-Czm",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Home({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
