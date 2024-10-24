import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import List from "./components/List";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks Page",
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
      <Breadcrumb pageName="Tasks" />
      <List />
    </>
  );
}
