import { defineStore } from "pinia";

export interface UserPreferencesState {
  darkMode: boolean;
  locale: string;
  view: "mosaic" | "list" | "tile";
}

export function getLocalUserPreferences(): UserPreferencesState {
  const localPreferences = window.localStorage.getItem("userPreferences");

  if (!localPreferences) {
    const darkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? true
        : false;
    const locale = window.navigator.language || "en-US";
    const view = "mosaic";
    return { darkMode, locale, view };
  }

  return JSON.parse(localPreferences);
}

const localUserPreferences = getLocalUserPreferences();

export const useUserPreferencesStore = defineStore("userPreferences", {
  state: (): UserPreferencesState => ({
    darkMode: localUserPreferences.darkMode,
    locale: localUserPreferences.locale,
    view: localUserPreferences.view,
  }),
  actions: {
    setLocale(locale: string) {
      this.locale = locale;
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    nextView() {
      if (this.view == "tile") {
        this.view = "mosaic";
      } else {
        this.view = this.view == "list" ? "tile" : "list";
      }
    },
  },
  persist: true,
});
