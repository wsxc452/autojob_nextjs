import Breadcrumb from "@/app/pc/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import ChargeCard from "./components/ChargeCard";
import { Tabs } from "antd";
import CodeForm from "./components/CodeForm";
import ChromeConfig from "./components/ChromeConfig";
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

const tabs = [
  {
    label: "欢迎页面",
    key: "welcome",
    children: <ChargeCard />,
  },
  {
    label: "卡密/口令",
    key: "code",
    children: <CodeForm />,
  },
  {
    label: "浏览器配置",
    key: "config",
    children: <ChromeConfig />,
  },
];

export default async function Page() {
  return (
    <div className="h-full w-full  ">
      <Breadcrumb pageName="欢迎" />
      <div className="flex h-full w-full  justify-center  bg-white p-10">
        <Tabs
          defaultActiveKey="1"
          type="card"
          items={tabs}
          className="w-full"
        />
      </div>
    </div>
  );
}
