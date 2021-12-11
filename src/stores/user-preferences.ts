import { defineStore } from "pinia";
import availableLocales from "vue-i18n";

export interface UserPreferencesState {
  darkMode: boolean;
  locale: string;
}

export function getLocalUserPreferences(): UserPreferencesState {
  const localPreferences = window.localStorage.getItem("userPreferences");

  if (!localPreferences) {
    return { darkMode: false, locale: "en-US" };
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
