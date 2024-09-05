import Breadcrumb from "@/app/pc/components/Breadcrumbs/Breadcrumb";
export default async function Dashboard() {
  console.log("同步用户数据");
  return <Breadcrumb pageName="数据看板" />;
}
