import { LogBody } from "@/app/(h5)/common/types";
import { UserInfo } from "@/types";
import { proxy } from "valtio";
import { subscribeKey } from "valtio/utils";
// const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");
// const themeAtom = atom({
//   key: "themeAtom", // unique ID (with respect to other atoms/selectors)
//   default: "light", // default value (aka initial value)
// });
// localStorage.getItem("color-theme") ||
const globaStore = proxy<{
  theme: any;
  userInfo: UserInfo;
  logs: LogBody[];
}>({
  theme: "light",
  userInfo: {
    name: "",
    email: "",
    avatar: "",
    id: "",
  },
  logs: [],
});
subscribeKey(globaStore, "theme", (colorMode) => {
  const className = "dark";
  const bodyClass = window.document.body.classList;
  localStorage.setItem("color-theme", colorMode);
  colorMode === "dark" ? bodyClass.add(className) : bodyClass.remove(className);
});

// subscribe(globaStore, () => {
//   localStorage.setItem("color-theme", globaStore.theme);
// });

export const userActions = {
  setTheme: (theme: any) => {
    globaStore.theme = theme;
  },
  setUserInfo: (userInfo: UserInfo) => {
    globaStore.userInfo = userInfo;
  },
  clearUserInfo: () => {
    globaStore.userInfo = { name: "", email: "", avatar: "", id: "" };
  },
};

export default globaStore;
