"use client";
import { Tabs } from "antd";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UpdateUser from "./UpdateUser";
import "./tabs.css";
const items = [
  {
    key: "0",
    label: "首页",
  },
  {
    key: "1",
    label: "配置",
  },
  {
    key: "2",
    label: "任务",
  },
  {
    key: "3",
    label: "日志",
    disabled: true,
  },
];

export default function HeadTabs() {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("");
  const path = usePathname();
  function callback(key: string) {
    console.log(key, typeof key);
    if (key === "1") {
      router.push("/h5/setting");
    } else if (key === "2") {
      router.push("/h5/tasks");
    } else if (key === "3") {
      console.log("index");
      // router.push("/h5/index");
    } else {
      router.push("/h5/welcome");
    }
  }

  useEffect(() => {
    console.log("path==", path);
    if (path === "/h5/setting") {
      setActiveKey("1");
    } else if (path === "/h5/tasks") {
      setActiveKey("2");
    } else if (path.includes("/h5/index")) {
      setActiveKey("3");
    } else {
      setActiveKey("0");
    }
  }, [path]);
  return (
    <>
      <Tabs
        items={items}
        className="custom-tabs"
        type="card"
        activeKey={activeKey}
        onChange={callback}
      />
      <UpdateUser />
    </>
  );
}
