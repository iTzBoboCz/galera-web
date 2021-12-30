import { MediaResponse } from "@galera/client-axios";
import { defineStore } from "pinia";

export interface SelectedMediaState {
  actionSelects: Array<string>;
  mediaModal: MediaResponse | undefined;
}

export const useSelectedMediaStore = defineStore("selectedMedia", {
  state: (): SelectedMediaState => ({
    actionSelects: [],
    mediaModal: undefined,
  }),
  getters: {
    isModalActive: (state) => (!state.mediaModal ? false : true),
  },
  actions: {
    setMediaModal(mediaModal: MediaResponse | undefined) {
      this.mediaModal = mediaModal;
    },
    setActionSelects(actionSelects: Array<string>) {
      this.actionSelects = actionSelects;
    },
    addToActionSelects(mediaUuid: string) {
      this.actionSelects.push(mediaUuid);
    },
    clearActionSelects() {
      this.actionSelects = [];
    },
    removeActionSelect(mediaUuid: string) {
      const index = this.actionSelects.indexOf(mediaUuid);

      this.actionSelects.splice(index, 1);
    },
  },
});
