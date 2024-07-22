import useLocalStorage from "@/hooks/useLocalStorage";
import { proxy, subscribe } from "valtio";
import { subscribeKey } from "valtio/utils";
// const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");
// const themeAtom = atom({
//   key: "themeAtom", // unique ID (with respect to other atoms/selectors)
//   default: "light", // default value (aka initial value)
// });
// localStorage.getItem("color-theme") ||
const globaStore = proxy<{
  theme: any;
}>({
  theme: "light",
});
subscribeKey(globaStore, "theme", (colorMode) => {
  console.log("state.count has changed to", colorMode);
  const className = "dark";
  const bodyClass = window.document.body.classList;
  localStorage.setItem("color-theme", colorMode);

  colorMode === "dark" ? bodyClass.add(className) : bodyClass.remove(className);
});

// subscribe(globaStore, () => {
//   localStorage.setItem("color-theme", globaStore.theme);
// });

export default globaStore;
