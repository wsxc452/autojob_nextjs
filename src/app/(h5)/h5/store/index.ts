import { getItem, getItemByUserId } from "@/service/users";
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
};
const h5Store = proxy<{
  userInfo: Users;
  chromeInfo: {
    path: string;
    platform: string;
  };
  currentTaskInfo: TaskItem;
  isOpended: boolean;
  logs: LogBody[];
}>({
  userInfo: { ...initUserInfo },
  chromeInfo: {
    path: "",
    platform: "",
  },
  currentTaskInfo: {
    id: -1,
    title: "",
    salary: "",
    position: [],
    staffnum: "",
    oid: "",
    filteredKeywords: [],
  },
  isOpended: false,
  logs: [],
});

subscribeKey(h5Store, "chromeInfo", () => {
  console.log("userInfo changed");
  localStorage.setItem("chromeInfo", JSON.stringify(h5Store.chromeInfo));
});
export const userActions = {
  setUserInfo: (userInfo: Users) => {
    h5Store.userInfo = userInfo;
  },
  clearUserInfo: () => {
    h5Store.userInfo = { ...initUserInfo };
  },
  setChromeIno: (value: { path: string; platform: string }) => {
    h5Store.chromeInfo = {
      path: value.path,
      platform: value.platform,
    };
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
