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
  isModalActive: (state): boolean => {
    if (!state.mediaModal) {
      return false;
    }

    return true;
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
  addToActionSelects({ commit }, { mediaUuid }: { mediaUuid: string }) {
    commit("addToActionSelects", { mediaUuid });
  },
  clearActionSelects({ commit }) {
    const actionSelects: Array<string> = [];
    commit("setActionSelects", { actionSelects });
  },
  removeActionSelect({ commit }, { mediaUuid }: { mediaUuid: string }) {
    commit("removeActionSelect", { mediaUuid });
  },
};

const mutations: MutationTree<SelectedMediaState> = {
  setMediaModal(state, { mediaModal }: { mediaModal: string | undefined }) {
    state.mediaModal = mediaModal;
  },
  setActionSelects(state, { actionSelects }: { actionSelects: Array<string> }) {
    state.actionSelects = actionSelects;
  },
  addToActionSelects(state, { mediaUuid }: { mediaUuid: string }) {
    state.actionSelects.push(mediaUuid);
  },
  removeActionSelect(state, { mediaUuid }: { mediaUuid: string }) {
    const index = state.actionSelects.indexOf(mediaUuid);

    state.actionSelects.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
