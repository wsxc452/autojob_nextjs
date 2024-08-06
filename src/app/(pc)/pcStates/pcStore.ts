import { Users } from "@prisma/client";
import { proxy } from "valtio";
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
  createdAt: new Date(),
  updatedAt: new Date(),
};
const pcStore = proxy<{
  userInfo: Users;
}>({
  userInfo: {...initUserInfo},
});

// subscribe(globaStore, () => {
//   localStorage.setItem("color-theme", globaStore.theme);
// });

export const userActions = {
  setUserInfo: (userInfo: Users) => {
    console.log('userInfo222,',userInfo);
    pcStore.userInfo = {...userInfo};
  },
  clearUserInfo: () => {
    pcStore.userInfo = {...initUserInfo};
  },
};

export default pcStore;
