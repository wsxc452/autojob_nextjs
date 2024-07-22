import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default async function Dashboard() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Dashboard" />
    </DefaultLayout>
  );
}
