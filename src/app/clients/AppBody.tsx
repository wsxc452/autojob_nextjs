"use client";
import Loader from "@/components/common/Loader";
import { useEffect, useState } from "react";
import { App, ConfigProvider, theme as antTheme } from "antd";
import { useSnapshot } from "valtio";
import globaStore from "@/states/globaStore";
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
      <App
        className="bg-green h-dvh w-full dark:bg-boxdark dark:text-bodydark"
        style={{}}
      >
        {loading ? <Loader /> : children}
      </App>
    </ConfigProvider>
  );
}
