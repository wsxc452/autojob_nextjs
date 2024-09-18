import { Button } from "antd";
import ActiveForm from "./ActiveForm";

function RefereerTwo({ isActived }: { isActived: boolean }) {
  return (
    <div className="border-dashed-200  flex h-[400px] max-w-[450px]  flex-col items-center rounded-lg border p-5">
      <div className="pb-2 text-lg">成为高级推荐人</div>
      <div>
        激活方式: <span>联系管理员付费升级,暂未开发</span>
      </div>
      <div>
        返利方式:
        <span> 订单金额 * 10% = 返现 </span>
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
              <td>30 * 10% = 3元</td>
            </tr>
            <tr>
              <td>季卡</td>
              <td>80元</td>
              <td>80 * 10% = 8元</td>
            </tr>
            <tr>
              <td>半年卡</td>
              <td>160元</td>
              <td>160* 10% = 16元</td>
            </tr>
            <tr>
              <td>年卡</td>
              <td>280元</td>
              <td>280 * 10% = 28元</td>
            </tr>
          </tbody>
        </table>
      </div>
      {!isActived && (
        <div className="py-3">
          <ActiveForm type="vip" />
        </div>
      )}
      <div>
        tips:
        <span>
          享受订单金额的10%返现
          <br />
          返现金额会自动存入账户余额,可用于提现
        </span>
      </div>
    </div>
  );
}

export default RefereerTwo;
