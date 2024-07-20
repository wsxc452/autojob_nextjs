import { auth } from "@/auth";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default async function Dashboard() {
  const session = await auth();
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Profile" />
        {session ? (
          <h1>{JSON.stringify(session, null, 2)}</h1>
        ) : (
          <h1>尚未登陆</h1>
        )}
      </div>
    </DefaultLayout>
  );
}
