"use client";
import { Button } from "antd";
import { useRouter } from "next/navigation";
function BackButton() {
  const router = useRouter();
  const goBack = () => {
    console.log("goBack");

    router.back();
  };
  return (
    <div className="ml-5">
      <Button type="primary" onClick={goBack}>
        返回任务列表
      </Button>
    </div>
  );
}

export default BackButton;
