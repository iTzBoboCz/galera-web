import { defineStore } from "pinia";

export interface UserPreferencesState {
  darkMode: boolean;
  locale: string;
}

export function getLocalUserPreferences(): UserPreferencesState {
  const localPreferences = window.localStorage.getItem("userPreferences");

  if (!localPreferences) {
    const darkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? true
        : false;
    const locale = window.navigator.language
      ? window.navigator.language
      : "en-US";
    return { darkMode, locale };
  }

  return JSON.parse(localPreferences);
}

const localUserPreferences = getLocalUserPreferences();

export const useUserPreferencesStore = defineStore("userPreferences", {
  state: (): UserPreferencesState => ({
    darkMode: localUserPreferences.darkMode,
    locale: localUserPreferences.locale,
  }),
  actions: {
    setLocale($i18n: any, locale: string) {
      this.locale = locale;
      $i18n.value = locale;
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
  },
  persist: true,
});
