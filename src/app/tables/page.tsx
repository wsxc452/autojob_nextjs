import Breadcrumb from "@/app/pc/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/app/pc/components/Tables/TableOne";
import TableThree from "@/app/pc/components/Tables/TableThree";
import TableTwo from "@/app/pc/components/Tables/TableTwo";

import { Metadata } from "next";
import DefaultLayout from "@/app/pc/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
