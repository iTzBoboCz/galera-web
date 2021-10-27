import { InjectionKey } from "vue";
import {
  ActionTree,
  createLogger,
  createStore,
  MutationTree,
  Store,
  useStore as baseUseStore,
} from "vuex";
import createPersistedState from "vuex-persistedstate";

import fetchedMedia, { FetchedMediaState } from "./modules/fetched-media";
import selectedMedia, { SelectedMediaState } from "./modules/selected-media";
import userPreferences, {
  UserPreferencesState,
} from "./modules/user-preferences";

export interface RootState {
  count: number;
}

export const state: RootState = {
  count: 0,
};

export interface AppState extends RootState {
  fetchedMedia: FetchedMediaState;
  userPreferences: UserPreferencesState;
  selectedMedia: SelectedMediaState;
}

// TODO: reset all store states on logout with vuex-extensions
export const actions: ActionTree<RootState, RootState> = {
  increment({ commit }) {
    commit("increment");
  },
};

export const mutations: MutationTree<RootState> = {
  increment(state) {
    state.count++;
  },
};

export const key: InjectionKey<Store<AppState>> = Symbol();

export const store = createStore({
  state,
  actions,
  mutations,
  modules: {
    fetchedMedia,
    userPreferences,
    selectedMedia,
  },
  plugins: [
    createLogger(),
    createPersistedState({ paths: ["count", "userPreferences"] }),
  ],
});

export function useStore(): Store<AppState> {
  return baseUseStore(key);
}
