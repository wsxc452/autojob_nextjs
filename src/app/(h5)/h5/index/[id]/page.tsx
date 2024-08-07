"use client";
import { Button } from "antd";
import { useParams } from "next/navigation";
import AutoOper from "@/app/h5/h5/common/AutoOper";
import LogList from "@/app/h5/h5/common/LogList";
function Page() {
  const { id } = useParams();
  console.log(id);

  function goFn(arg0: string): void {
    throw new Error("Function not implemented.");
  }
  return (
    <div className="page flex h-full w-full flex-col items-center justify-center overflow-hidden !bg-sky-400 px-5">
      {/* <div className="my-5 flex w-full flex-row  justify-between gap-5">
        <Button onClick={() => goFn("back")}>返回</Button>
        <Button onClick={() => goFn("reload")}>刷新</Button>
        <Button onClick={() => goFn("forward")}>前进</Button>
      </div> */}
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
  );
}

export default Page;
