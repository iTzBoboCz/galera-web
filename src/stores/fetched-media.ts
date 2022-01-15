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

      const albumList: Array<Album<MediaResponse>> | undefined = [];
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
    async mediaLike(media: MediaResponse) {
      // TODO: fix CORS; looks like this always returns true
      // https://stackoverflow.com/questions/54540881/why-does-my-instance-of-axios-not-return-the-response-in-a-caught-error
      const success = await api()
        .routesMediaLike({ mediaUuid: media.uuid })
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });

      if (success && this.likedMedia) {
        // sometimes the liked images were duplicite (probably related to CORS)
        const alreadyExists = this.likedMedia.some((m) => m.uuid == media.uuid);

        if (!alreadyExists) {
          this.likedMedia.push(media);
        }
      }
    },
    async mediaUnlike(mediaUuid: string) {
      const success = await api()
        .routesMediaUnlike({ mediaUuid })
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });

      if (success && this.likedMedia) {
        const index = this.likedMedia.findIndex(
          (media) => media.uuid == mediaUuid
        );
        if (index > -1) {
          this.likedMedia.splice(index, 1);
        }
      }
    },
    async getSystemInfoPublic() {
      this.systemInfoPublic = await api()
        .routesSystemInfoPublic()
        .then((response) => {
          return response.data;
        });
    },
    async scanMedia() {
      await api()
        .routesScanMedia()
        .then((response) => {
          return response.data;
        });
    },
  },
});
