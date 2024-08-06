"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/app/pc/components/Sidebar/SidebarItem";
import ClickOutside from "@/app/pc/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import pcStore from "../../pcStates/pcStore";
import { useSnapshot } from "valtio";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
interface MenuItem {
  label: string;
  route: string;
  isAdmin?: boolean;
  children?: MenuItem[];
}

interface MenuGroup {
  name: string;
  menuItems: MenuItem[];
}

function filterMenuItems(
  menuGroups: MenuGroup[],
  isAdmin: boolean,
): MenuGroup[] {
  function filterItems(items: MenuItem[]): MenuItem[] {
    return items.filter((item) => {
      if (item.isAdmin !== undefined) {
        return isAdmin ? item.isAdmin : !item.isAdmin;
      }
      if (item.children) {
        item.children = filterItems(item.children);
        return item.children.length > 0;
      }
      return true;
    });
  }

  return menuGroups
    .map((group) => ({
      ...group,
      menuItems: filterItems(group.menuItems),
    }))
    .filter((group) => group.menuItems.length > 0);
}
const menuGroups = [
  {
    name: "菜单",
    menuItems: [
      {
        label: "Dashboard",
        route: "/dashboard",
      },
      {
        label: "任务列表",
        route: "#",
        children: [
          { label: "新增任务", route: "/task/edit" },
          { label: "任务列表", route: "/task" },
        ],
      },
      {
        label: "用户管理",
        route: "/users",
        isAdmin: true,
      },
      {
        label: "卡券管理",
        route: "/cards",
        isAdmin: true,
        children: [
          { label: "新增卡券类别", route: "/cardTypes/add" },
          { label: "卡券列表列表", route: "/cardTypes" },
          // { label: "发行卡券", route: "/cards/publish" },
          { label: "卡券列表", route: "/cards" },
        ],
      },
    ],
  },
  {
    name: "OTHERS",
    menuItems: [
      {
        label: "分销商管理",
        route: "/chart",
        isAdmin: true,
      },
      {
        label: "智能投递",
        route: "#",
        children: [
          { label: "Alerts", route: "/ui/alerts" },
          { label: "Buttons", route: "/ui/buttons" },
        ],
      },
      {
        label: "用户统计",
        route: "#",
        isAdmin: true,
        children: [
          { label: "Sign In", route: "/auth/signin" },
          { label: "Sign Up", route: "/auth/signup" },
        ],
      },
    ],
  },
];
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  // const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const { userInfo } = useSnapshot(pcStore);

  const menus = useMemo(() => {
    if (userInfo?.isSuperUser === true) {
      return filterMenuItems(menuGroups, true) || [];
    } else {
      return filterMenuItems(menuGroups, false) || [];
    }
  }, [userInfo]);
  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link
            href="/"
            className=" w-full items-center justify-end text-center "
          >
            {/* <Image
              width={176}
              height={32}
              src={"/images/logo/logo.svg"}
              alt="Logo"
              priority
            /> */}
            <div className="text-left text-[40px] text-white">AutoJob</div>
            <div className="text-left text-indigo-200">387558862@qq.com</div>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menus.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem: any, menuIndex: number) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
