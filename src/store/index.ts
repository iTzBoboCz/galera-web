import { InjectionKey } from "vue";
import {
  ActionTree,
  createStore,
  createLogger,
  useStore as baseUseStore,
  Store,
  MutationTree,
} from "vuex";
import userPreferences, {
  UserPreferencesState,
} from "./modules/user-preferences";
import createPersistedState from "vuex-persistedstate";

export interface RootState {
  count: number;
}

export const state: RootState = {
  count: 0,
};

export interface AppState extends RootState {
  userPreferences: UserPreferencesState;
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
    userPreferences,
  },
  plugins: [createLogger(), createPersistedState()],
});

export function useStore(): Store<AppState> {
  return baseUseStore(key);
}
