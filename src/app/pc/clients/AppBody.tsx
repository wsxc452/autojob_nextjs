"use client";
import Loader from "@/app/pc/components/common/Loader";
import { useEffect, useState } from "react";
import { App, ConfigProvider, theme as antTheme } from "antd";
import { useSnapshot } from "valtio";
import globaStore from "@/app/pc/pcStates/pcStore";
export default function AppBody({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useSnapshot(globaStore);
  useEffect(() => {
    globaStore.theme = localStorage.getItem("color-theme") || "light";
    // setTimeout(() => setLoading(false), 200);
    setLoading(false);
  }, []);
  return (
    <ConfigProvider
      theme={{
        algorithm: [
          theme == "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        ],
      }}
    >
      {loading ? <Loader /> : children}
      {/* <App
        className="bg-green h-full w-full dark:bg-boxdark dark:text-bodydark"
      >
        {loading ? <Loader /> : children}
      </App> */}
    </ConfigProvider>
  );
}
