import { getItemByUserId } from "@/service/users";
import { TaskItem } from "@/types";
import { Users } from "@prisma/client";
import { proxy } from "valtio";
import { subscribeKey } from "valtio/utils";
import { LogBody } from "../../common/types";
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

const h5Store = proxy<{
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
export type h5StoreKeys = typeof h5Store;
subscribeKey(h5Store, "chromeInfo", () => {
  localStorage.setItem("chromeInfo", JSON.stringify(h5Store.chromeInfo));
});
export const userActions = {
  setUserInfo: (
    userInfo: Users & {
      greetings: [];
    },
  ) => {
    h5Store.userInfo = userInfo;
  },
  setIsTaskEnd: (val: boolean) => {
    h5Store.isTaskEnd = val;
  },
  clearUserInfo: () => {
    h5Store.userInfo = { ...initUserInfo };
  },
  setChromeIno: (value: { chromePath: string; platform: string }) => {
    h5Store.chromeInfo = {
      chromePath: value.chromePath,
      platform: value.platform,
    };
  },
  setCurrentTaskInfo: (taskInfo: TaskItem) => {
    h5Store.currentTaskInfo = { ...taskInfo };
  },
  syncUserInfo: async (userId: string) => {
    const userInfo = await getItemByUserId(userId);
    if (userInfo.status === 200 && userInfo.data) {
      console.log("userInfo", userInfo);
      h5Store.userInfo.points = userInfo.data.points;
    }
  },
  setIsOpended: (val: boolean) => {
    h5Store.isOpended = val;
  },
  addLog: (log: LogBody) => {
    console.log("addLog....====");
    h5Store.logs.push({
      id: h5Store.logs.length,
      time: log.time,
      type: log.type,
      message: log.message,
    });
  },
  setLogs: (logs: LogBody[]) => {
    h5Store.logs = logs;
  },
  clearLog: () => {
    console.log("clearLog....");
    h5Store.logs = [];
  },
};

export default h5Store;
