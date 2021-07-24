import { ActionTree, MutationTree } from "vuex";

import { RootState } from "..";

export interface UserPreferencesState {
  darkMode: boolean;
  locale: string;
}

export const state = (): UserPreferencesState => ({
  darkMode: false,
  locale: "auto",
});

const getters = {};

const actions: ActionTree<UserPreferencesState, RootState> = {
  setLocale({ commit }, { locale }: { locale: string }) {
    commit("setLocale", { locale });
  },
};

const mutations: MutationTree<UserPreferencesState> = {
  setLocale(state, { locale }: { locale: string }) {
    state.locale = locale;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
