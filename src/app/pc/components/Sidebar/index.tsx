"use client";

import React, { useMemo } from "react";
import Link from "next/link";
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
  function filterItems(items: any) {
    return items
      .filter((item: any) => {
        // console.log("item", item);
        // 过滤子菜单
        if (item.children) {
          item.children = filterItems(item.children);
          // console.log("item.children", item.children);
        }

        if (item.isAdmin === true && isAdmin === false) {
          return false;
        }

        // // 根据 isAdmin 过滤菜单项
        // if (item.isAdmin !== undefined) {
        //   console.log(item, item.isAdmin !== undefined ? item.isAdmin : true);
        //   return item.isAdmin !== undefined ? isAdmin || item.isAdmin : true;
        // }

        // 返回 true 以保留非管理员项
        return true;
      })
      .filter((item: any) => {
        // 过滤掉没有子项的菜单项
        // console.log("22", item);
        return item.children ? item.children.length > 0 : true;
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
        label: "首页",
        route: "/pc/welcome",
        isAdmin: false,
      },
      {
        label: "数据看板",
        route: "/pc/dashboard",
        isAdmin: false,
      },
      {
        label: "任务配置",
        route: "/pc/configs/greetings",
        isAdmin: false,
        children: [
          { label: "打招呼组配置", route: "/pc/configs/greegting_group" },
          { label: "打招呼语配置", route: "/pc/configs/greetings" },
          { label: "核销记录", route: "/pc/configs/userCodes", isAdmin: true },
        ],
      },
      {
        label: "任务列表",
        route: "/pc/task/edit",
        isAdmin: false,
        children: [
          { label: "新增任务", route: "/pc/task/edit" },
          { label: "任务列表", route: "/pc/task" },
          { label: "投递记录", route: "/pc/search" },
        ],
      },
      {
        label: "卡券管理",
        route: "/pc/cards",
        isAdmin: true,
        children: [
          { label: "新增卡券类别", route: "/pc/cardTypes/add" },
          { label: "卡券类别列表", route: "/pc/cardTypes" },
          { label: "卡券列表", route: "/pc/cards" },
        ],
      },
      {
        label: "口令管理",
        route: "/pc/words",
        isAdmin: true,
        children: [
          { label: "新增口令", route: "/pc/words/add" },
          { label: "口令列表", route: "/pc/words/list" },
          { label: "核销记录", route: "/pc/words/record" },
        ],
      },
      {
        label: "账户记录",
        route: "/pc/words",
        isAdmin: false,
        children: [
          { label: "推广激活", route: "/pc/referrer/active" },
          {
            label: "推广列表",
            route: "/pc/referrer/recordByUser",
            isAdmin: false,
          },
          {
            label: "账户变更",
            route: "/pc/users/accountLog",
            isAdmin: false,
          },
        ],
      },
      {
        label: "推荐人计划",
        route: "/pc/referrer/active",
        isAdmin: true,
        children: [
          // { label: "推广激活", route: "/pc/referrer/active" },
          { label: "返利列表", route: "/pc/referrer/record" },
          { label: "推广人排名Top", route: "/pc/cardTypes" },
        ],
      },
      {
        label: "代理管理",
        route: "/pc/referrer/baseList",
        isAdmin: true,
        children: [
          { label: "推荐人列表", route: "/pc/referrer/baseList" },
          { label: "代理人列表", route: "/pc/referrer/vipList" },
          { label: "提现列表", route: "/pc/cardTypes" },
        ],
      },
    ],
  },
  // {
  //   name: "OTHERS",
  //   menuItems: [
  //     {
  //       label: "分销商管理",
  //       route: "/pc/chart",
  //       isAdmin: true,
  //     },
  //     {
  //       label: "智能投递",
  //       route: "#",
  //       children: [
  //         { label: "Alerts", route: "/pc/ui/alerts" },
  //         { label: "Buttons", route: "/pc/ui/buttons" },
  //       ],
  //     },
  //     {
  //       label: "用户统计",
  //       route: "#",
  //       isAdmin: true,
  //       children: [
  //         { label: "Sign In", route: "/pc/auth/signin" },
  //         { label: "Sign Up", route: "/pc/auth/signup" },
  //       ],
  //     },
  // ],
  // },
];
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  // const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "pc/welcome");
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
        <div className="flex items-center justify-between gap-2 px-6 py-2.5 lg:py-3.5">
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
            <div className="pt-5 text-left text-[18px] text-indigo-200">
              QQ群:238596059
            </div>
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
          <nav className="mt-5 px-4 py-4 lg:mt-2 lg:px-6">
            {menus.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name} - {groupIndex}
                </h3> */}

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
