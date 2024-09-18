"use client";
import { useSnapshot } from "valtio";
import pcStore from "@/app/pc/pcStates/pcStore";
import RefereerOne from "./components/RefereerOne";
import RefereerTwo from "./components/RefereerTwo";

function ActivePage() {
  const { userInfo } = useSnapshot(pcStore);
  //   const userInfo = pcStoreData.userInfo;
  // console.log("userInfo", userInfo);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10">
      <div className="flex flex-row gap-10">
        <RefereerOne isActived={userInfo.isReferrer} />
        {/* <RefereerTwo isActived={userInfo.isVip} /> */}
      </div>
    </div>
  );
}

export default ActivePage;
