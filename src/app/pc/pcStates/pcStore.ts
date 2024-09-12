import { Users } from "@prisma/client";
import { proxy } from "valtio";
import { LogBody } from "../common/types";
import { TaskItem } from "@/types";
import { subscribeKey } from "valtio/utils";
import { getItemByUserId } from "@/service/users";
// import { subscribeKey } from "valtio/utils";
// const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");
// const themeAtom = atom({
//   key: "themeAtom", // unique ID (with respect to other atoms/selectors)
//   default: "light", // default value (aka initial value)
// });
// localStorage.getItem("color-theme") ||
const initUserInfo = {
  id: 0,
  userId: "",
  dId: "",
  email: "",
  userName: null,
  firstName: null,
  lastName: null,
  fullName: null,
  passwordHash: "",
  points: 0,
  isVip: false,
  isSuperUser: false,
  roleId: 1,
  isDistributor: false,
  isActive: false,
  additionalInfo: "",
  avatar: "",
  isAbnormal: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  greetings: [],
} as any;

const pcStore = proxy<{
  theme: any;
  userInfo: Users & {
    greetings: [];
  };
  chromeInfo: {
    chromePath: string;
    platform: string;
  };
  currentTaskInfo: TaskItem;
  isOpended: boolean;
  isTaskEnd: boolean;
  logs: LogBody[];
}>({
  theme: "light",
  userInfo: { ...initUserInfo },
  chromeInfo: {
    chromePath: "",
    platform: "",
  },
  currentTaskInfo: {
    id: -1,
    title: "",
    staffnum: "",
    positionKeywords: [],
    userId: "",
    filteredKeywords: [],
    maxCount: 0,
    isIgnorePassed: false,
    passCompanys: [],
    cityCode: "",
    cityName: "",
    activeCheck: false,
    headhunterCheck: false,
    bossOnlineCheck: false,
    searchText: "",
    experienceValue: "", // 经验要求
    degreeValue: "", // 学历要求
    salaryValue: "", // 薪资要求
    scaleValue: "", // 公司规模要求
    greetingGroupId: 0,
  },
  isOpended: false,
  isTaskEnd: true,
  logs: [],
});

subscribeKey(pcStore, "chromeInfo", () => {
  localStorage.setItem("chromeInfo", JSON.stringify(pcStore.chromeInfo));
});
subscribeKey(pcStore, "theme", (colorMode) => {
  const className = "dark";
  const bodyClass = window.document.body.classList;
  localStorage.setItem("color-theme", colorMode);
  colorMode === "dark" ? bodyClass.add(className) : bodyClass.remove(className);
});

export const userActions = {
  setTheme: (theme: any) => {
    pcStore.theme = theme;
  },
  setUserInfo: (
    userInfo: Users & {
      greetings: [];
    },
  ) => {
    pcStore.userInfo = { ...userInfo };
  },
  setIsTaskEnd: (val: boolean) => {
    pcStore.isTaskEnd = val;
  },
  clearUserInfo: () => {
    pcStore.userInfo = { ...initUserInfo };
  },
  setChromeIno: (value: { chromePath: string; platform: string }) => {
    pcStore.chromeInfo = {
      chromePath: value.chromePath,
      platform: value.platform,
    };
  },
  setCurrentTaskInfo: (taskInfo: TaskItem) => {
    pcStore.currentTaskInfo = { ...taskInfo };
  },
  syncUserInfo: async (userId: string) => {
    const userInfo = await getItemByUserId(userId);
    if (userInfo.status === 200 && userInfo.data) {
      // pcStore.userInfo.points = userInfo.data.points;
      pcStore.userInfo = Object.assign({}, pcStore.userInfo, userInfo.data);
    }
  },
  setIsOpended: (val: boolean) => {
    pcStore.isOpended = val;
  },
  addLog: (log: LogBody) => {
    pcStore.logs.push({
      id: pcStore.logs.length,
      time: log.time,
      type: log.type,
      message: log.message,
    });
  },
  setLogs: (logs: LogBody[]) => {
    pcStore.logs = logs;
  },
  clearLog: () => {
    console.log("clearLog....");
    pcStore.logs = [];
  },
};

export default pcStore;
