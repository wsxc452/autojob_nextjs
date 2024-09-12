import Breadcrumb from "@/app/pc/components/Breadcrumbs/Breadcrumb";
import ChartGroups from "./components/ChartGroups";

export default async function Dashboard() {
  return (
    <>
      <Breadcrumb pageName="数据看板" />
      <ChartGroups />
    </>
  );
}
