import {
  AlbumResponse,
  MediaResponse,
  SystemInfoPublic,
} from "@galera/client-axios";
import { defineStore } from "pinia";

import api from "~/composables/api";

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
  systemInfoPublic: SystemInfoPublic | undefined;
}

export const useFetchedMediaStore = defineStore("fetchedMedia", {
  state: (): FetchedMediaState => ({
    allMedia: [],
    likedMedia: [],
    albumList: [],
    systemInfoPublic: undefined,
  }),
  getters: {
    numberOfAllMedia: (state) => state.allMedia?.length,
    numberOfLikedMedia: (state) => state.likedMedia?.length,
    numberOfAlbumMedia: (state) => {
      if (state.albumList === undefined) {
        return;
      }

      const result: AlbumMediaCount = {};

      for (const album of state.albumList) {
        if (album.media) {
          result[album.link] = album.media.length;
        }
      }

      return result;
    },
  },
  actions: {
    async getAllMedia() {
      this.allMedia = await api()
        .routesMediaStructure()
        .then((response) => {
          return response.data;
        });
    },
    async getLikedMedia() {
      this.likedMedia = await api()
        .routesGetMediaLikedList()
        .then((response) => {
          return response.data;
        });
    },
    async getAlbumList() {
      const albumResponse = await api()
        .routesGetAlbumList()
        .then((response) => {
          return response.data;
        });

      let albumList: Array<Album<MediaResponse>> | undefined;
      for (const album of albumResponse) {
        albumList?.push(album);
      }

      this.albumList = albumList;
    },
    async getAlbumMedia(albumUuid: string) {
      const albumResponse = await api()
        .routesGetAlbumStructure({ albumUuid })
        .then((response) => {
          return response.data;
        });
      // TODO: finish later
      // commit("getAlbumList", { albumResponse });
    },
    async mediaUnlike(mediaUuid: string) {
      api()
        .routesMediaUnlike({ mediaUuid })
        .then((response) => {
          return response.status;
        })
        .catch((error) => {
          // TODO: doesn't seem to work
          console.log(error);
          return;
        });
      // TODO: finish later
    },
    async getSystemInfoPublic() {
      this.systemInfoPublic = await api()
        .routesSystemInfoPublic()
        .then((response) => {
          return response.data;
        });
    },
  },
});
