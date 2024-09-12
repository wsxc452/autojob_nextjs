import Breadcrumb from "@/app/pc/components/Breadcrumbs/Breadcrumb";

import AutoOper from "../../components/AutoOper";
import LogList from "../../components/LogList";
import BackButton from "./BackButton";
function Page() {
  return (
    <>
      <Breadcrumb pageName="任务" />
      <BackButton />
      <div className="page flex h-full w-full flex-col items-center justify-center overflow-hidden px-5">
        <div className="mt-5 flex h-[130px] w-full flex-col  items-center gap-3 rounded-lg text-sm">
          <AutoOper />
        </div>
        <div className="my-5 w-full flex-1 overflow-hidden rounded bg-white bg-opacity-70 p-3">
          <LogList />
        </div>
        {/* <div className="flex h-[80px] w-full  flex-row  text-white">
        <Versions />
      </div> */}
      </div>
    </>
  );
}

export default Page;
