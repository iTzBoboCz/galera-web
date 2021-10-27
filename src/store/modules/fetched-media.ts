import { AlbumResponse, MediaResponse } from "@galera/client-axios";
import { ActionTree, GetterTree, MutationTree } from "vuex";

import api from "~/composables/api";

import { RootState } from "..";

export interface Album<MediaResponse> extends AlbumResponse {
  media?: MediaResponse[];
}

export interface AlbumMediaCount {
  [key: string]: number;
}

export interface FetchedMediaState {
  allMedia: Array<MediaResponse> | undefined;
  likedMedia: Array<MediaResponse> | undefined;
  albumList: Array<Album<MediaResponse>> | undefined;
}

export const state = (): FetchedMediaState => ({
  allMedia: [],
  likedMedia: [],
  albumList: [],
});

const getters: GetterTree<FetchedMediaState, RootState> = {
  numberOfAllMedia: (state): number | undefined => {
    return state.allMedia?.length;
  },
  numberOfLikedMedia: (state): number | undefined => {
    return state.likedMedia?.length;
  },
  numberOfAlbumMedia: (state): AlbumMediaCount | undefined => {
    if (state.albumList === undefined) {
      return undefined;
    }

    const result: AlbumMediaCount = {};

    for (const album of state.albumList) {
      if (album.media) {
        result[album.link] = album.media.length;
      }
    }

    return result;
  },
};

const actions: ActionTree<FetchedMediaState, RootState> = {
  async getAllMedia({ commit }) {
    const allMedia = await api.routesMediaStructure().then((response) => {
      return response.data;
    });
    commit("getAllMedia", { allMedia });
  },
  async getLikedMedia({ commit }) {
    const likedMedia = await api.routesGetMediaLikedList().then((response) => {
      return response.data;
    });
    commit("getLikedMedia", { likedMedia });
  },
  async getAlbumList({ commit }) {
    const albumResponse = await api.routesGetAlbumList().then((response) => {
      return response.data;
    });
    commit("getAlbumList", { albumResponse });
  },
  async getAlbumMedia({ commit }, { albumUuid }: { albumUuid: string }) {
    const albumResponse = await api
      .routesGetAlbumStructure({ albumUuid })
      .then((response) => {
        return response.data;
      });
    commit("getAlbumList", { albumResponse });
  },
  async mediaUnlike({ commit }, { mediaUuid }: { mediaUuid: string }) {
    api
      .routesMediaUnlike({ mediaUuid })
      .then((response) => {
        commit("mediaUnlike", { mediaUuid });
        return response.status;
      })
      .catch((error) => {
        // TODO: doesn't seem to work
        console.log(error);
        return;
      });
  },
};

const mutations: MutationTree<FetchedMediaState> = {
  getAllMedia(state, { allMedia }: { allMedia: MediaResponse[] }) {
    state.allMedia = allMedia;
  },
  getLikedMedia(state, { likedMedia }: { likedMedia: MediaResponse[] }) {
    state.likedMedia = likedMedia;
  },
  getAlbumList(state, { albumResponse }: { albumResponse: AlbumResponse[] }) {
    let albumList: Array<Album<MediaResponse>> | undefined;
    for (const album of albumResponse) {
      albumList?.push(album);
    }
    state.albumList = albumList;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
