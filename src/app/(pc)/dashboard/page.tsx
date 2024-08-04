import "server-only";
import Breadcrumb from "@/app/pc/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/app/pc/components/Layouts/DefaultLayout";
import UpdateUser from "./UpdateUser";
export default async function Dashboard() {
  console.log("同步用户数据");
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Dashboard" />
      <UpdateUser />
    </DefaultLayout>
  );
}
