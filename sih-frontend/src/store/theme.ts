import { atom } from "recoil";

export const themeState = atom<boolean>({
  key: "themeState",
  default: (() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) return saved === "true"; // convert string to boolean
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
    return false;
  })(),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("darkMode", String(newValue));
          document.documentElement.classList.toggle("dark", newValue);
        }
      });
    },
  ],
});
