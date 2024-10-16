"use client";
import Breadcrumb from "@/app/pc/components/Breadcrumbs/Breadcrumb";

import { useParams } from "next/navigation";
import AutoOper from "./components/AutoOper";
import LogList from "./components/LogList";
import BackButton from "./components/BackButton";

function TaskPage() {
  const { id } = useParams();
  return (
    <div>
      <Breadcrumb pageName="爬虫任务" />
      <BackButton />
      <div className="page flex h-full w-full flex-col items-center justify-center overflow-hidden px-5">
        <div className="mt-5 flex h-[130px] w-full flex-col  items-center gap-3 rounded-lg text-sm">
          <AutoOper />
        </div>
        <div className="my-5 w-full flex-1 overflow-hidden rounded bg-white bg-opacity-70 p-3">
          <LogList />
        </div>
      </div>
    </div>
  );
}

export default TaskPage;
