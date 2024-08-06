import Breadcrumb from "@/app/pc/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import List from "./components/List";

export const metadata: Metadata = {
  title: "Users Page",
};
// export async function generateStaticParams() {
//   return [];
// }

// type Repo = {
//   name: string;
//   stargazers_count: number;
// };

export default async function Page() {
  return (
    <>
      <Breadcrumb pageName="Users" />
      <List />
    </>
  );
}
