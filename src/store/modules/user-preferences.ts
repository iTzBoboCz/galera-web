import { ActionTree, MutationTree } from "vuex";

import { RootState } from "..";

export interface UserPreferencesState {
  darkMode: boolean;
  locale: string;
}

export function getLocalUserPreferences(): UserPreferencesState {
  const localPreferences = window.localStorage.getItem("vuex");

  // eslint-disable-next-line unicorn/no-null
  if (localPreferences == null) {
    return { darkMode: false, locale: "en-US" };
  }

  return JSON.parse(localPreferences).userPreferences;
}

const localUserPreferences = getLocalUserPreferences();

export const state = (): UserPreferencesState => ({
  darkMode: localUserPreferences.darkMode,
  locale: localUserPreferences.locale,
});

const getters = {};

const actions: ActionTree<UserPreferencesState, RootState> = {
  setLocale({ commit }, { $i18n, locale }: { $i18n: any; locale: string }) {
    commit("setLocale", { $i18n, locale });
  },
  toggleDarkMode({ commit }) {
    commit("toggleDarkMode");
  },
};

const mutations: MutationTree<UserPreferencesState> = {
  setLocale(state, { $i18n, locale }: { $i18n: any; locale: string }) {
    state.locale = locale;
    $i18n.value = locale;
  },
  toggleDarkMode(state) {
    state.darkMode = !state.darkMode;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
