"use client";

import { snapshot } from "valtio";
import ActiveForm from "./ActiveForm";
import pcStore from "@/app/pc/pcStates/pcStore";
import { useEffect, useState } from "react";

function RefereerOne({ isActived }: { isActived: boolean }) {
  const { userInfo } = snapshot(pcStore);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);
  return (
    <div
      className={` flex  h-[400px] max-w-[450px] flex-col items-center rounded-lg border-2 border-solid p-5  shadow-lg shadow-bodydark	
        ${userInfo.isReferrer ? "border-sky-500" : "border-dashed-200"} ${loading ? "hidden" : ""}`}
    >
      {/* <div className="w-full text-wrap">{JSON.stringify(userInfo)}</div> */}

      {userInfo.isReferrer ? (
        <div className="pb-2 text-lg text-sky-600">
          您已激活, 您的推荐码:{userInfo.referrerCode}
        </div>
      ) : (
        <div className="pb-2 text-lg">成为推荐人</div>
      )}

      <div>
        激活方式: <span>首次消费卡券后可激活(最低月卡)</span>
      </div>
      <div>
        返利方式:
        <span> 订单金额 * 100 * 0.2 = 返点积分</span>
      </div>

      <div className="py-2">
        <table>
          <tbody>
            <tr>
              <td width={70}>卡券类型</td>
              <td width={90}>卡券金额</td>
              <td>返利</td>
            </tr>
            <tr>
              <td>月卡</td>
              <td>30元</td>
              <td>30*100 * 20% = 600积分</td>
            </tr>
            <tr>
              <td>季卡</td>
              <td>80元</td>
              <td>80*100 * 20% = 1600积分</td>
            </tr>
            <tr>
              <td>半年卡</td>
              <td>160元</td>
              <td>160*100 * 20% = 3200积分</td>
            </tr>
            <tr>
              <td>年卡</td>
              <td>280元</td>
              <td>280*100 * 20% = 5600积分</td>
            </tr>
          </tbody>
        </table>
      </div>
      {!isActived && (
        <div className="py-3">
          <ActiveForm type="base" />
        </div>
      )}
      <div>
        tips:
        <span> 积分仅可用来投递简历,打招呼,无法提现</span>
      </div>
    </div>
  );
}

export default RefereerOne;
