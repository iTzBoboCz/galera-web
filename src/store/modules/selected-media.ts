import { ActionTree, GetterTree, MutationTree } from "vuex";

import { RootState } from "..";

export interface SelectedMediaState {
  actionSelects: Array<string>;
  mediaModal: string | undefined;
}

export const state = (): SelectedMediaState => ({
  actionSelects: [],
  mediaModal: undefined,
});

const getters: GetterTree<SelectedMediaState, RootState> = {
  actionSelects: (state): Array<string> => {
    return state.actionSelects;
  },
  mediaModal: (state): string | undefined => {
    return state.mediaModal;
  },
};

const actions: ActionTree<SelectedMediaState, RootState> = {
  setMediaModal(
    { commit },
    { mediaModal }: { mediaModal: string | undefined }
  ) {
    commit("setMediaModal", { mediaModal });
  },
  setActionSelects(
    { commit },
    { actionSelects }: { actionSelects: Array<string> }
  ) {
    commit("setActionSelects", { actionSelects });
  },
  addToActionSelects({ commit }, { actionSelect }: { actionSelect: string }) {
    commit("addToActionSelects", { actionSelect });
  },
  clearActionSelects({ commit }) {
    const actionSelects: Array<string> = [];
    commit("setActionSelects", { actionSelects });
  },
};

const mutations: MutationTree<SelectedMediaState> = {
  setMediaModal(state, { mediaModal }: { mediaModal: string | undefined }) {
    state.mediaModal = mediaModal;
  },
  setActionSelects(state, { actionSelects }: { actionSelects: Array<string> }) {
    state.actionSelects = actionSelects;
  },
  addToActionSelects(state, { actionSelect }: { actionSelect: string }) {
    state.actionSelects.push(actionSelect);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
