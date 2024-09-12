import Breadcrumb from "@/app/pc/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import ChargeCard from "./components/ChargeCard";
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
    <div className="h-full w-full  ">
      <Breadcrumb pageName="欢迎" />
      <div className="flex h-full w-full  justify-center  p-10">
        <div className="w-[550px]">
          <ChargeCard />
        </div>
      </div>
    </div>
  );
}
