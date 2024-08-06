"use client";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useRouter } from "next/navigation";
type MenuItem = Required<MenuProps>["items"][number];
export default function Menus() {
  const router = useRouter();
  const items: MenuItem[] = [
    {
      key: "sub1",
      label: "个人中心",
      icon: <MailOutlined />,
      children: [
        {
          key: "welcome",
          label: "欢迎页面",
        },
        {
          key: "card",
          label: "卡密设置",
        },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "sub2",
      label: "投递管理",
      icon: <AppstoreOutlined />,
      children: [
        { key: "5", label: "Option 5" },
        { key: "6", label: "Option 6" },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "sub4",
      label: "其他",
      icon: <SettingOutlined />,
      children: [
        { key: "9", label: "Option 9" },
        { key: "10", label: "Option 10" },
        { key: "11", label: "Option 11" },
        { key: "12", label: "Option 12" },
      ],
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    if (e.key === "welcome") {
      console.log("welcome");
      router.push("/h5/welcome");
    } else if (e.key === "card") {
      console.log("card");
      router.push("/h5/welcome/card");
    }
  };

  return (
    <>
      <Menu
        onClick={onClick}
        style={{ width: "100%" }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
    </>
  );
}
