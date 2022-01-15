@@ -0,0 +1,289 @@
<template>
  <div v-if="loaded" class="media-container">
    <div
      v-for="media in mediaList"
      :key="media.filename"
      class="media"
      loading="lazy"
    >
      <ImageWrapper
        :media="media"
        :class="{ mediaInfo: mediaInfoIsActive(media.uuid) }"
      />
      <div class="image-inner">
        <div class="image-inner-relative" @click="mediaClick(media)">
          <span :class="{ displayNone: !mediaInfoIsActive(media.uuid) }">{{
            getLocalizedDate(new Date(media.date_taken), media.date_taken)
          }}</span>
          <!-- TODO: fix later; absolute prop doesn't seem to work yet -->
          <v-btn
            icon
            bottom="1.5vh"
            left="1.5vh"
            color="red"
            variant="text"
            position="absolute"
            @click.stop="likeToggle(media)"
          >
            <v-icon v-if="isLiked(media.uuid)" color="red">mdi-heart</v-icon>
            <v-icon v-if="!isLiked(media.uuid)" color="grey"
              >mdi-heart-outline</v-icon
            >
          </v-btn>
          <v-btn
            icon="mdi-information-outline"
            top="1.5vh"
            right="1.5vh"
            color="grey"
            variant="text"
            position="absolute"
            @click.stop="toggleInfo(media.uuid)"
          />
          <v-btn
            icon
            bottom="1.5vh"
            right="1.5vh"
            color="blue"
            variant="text"
            position="absolute"
            :class="{ visible: isSomethingSelected() }"
            @click.stop="toggleSelection(media.uuid)"
          >
            <v-icon v-if="!isSelected(media.uuid)" color="grey"
              >mdi-checkbox-blank-circle-outline</v-icon
            >
            <v-icon v-if="isSelected(media.uuid)" color="blue"
              >mdi-checkbox-blank-circle</v-icon
            >
          </v-btn>
        </div>
      </div>
    </div>
  </div>
  <!-- v-speed-dial is not implemented yet -->
  <!-- <v-fab-transition>
    <v-btn
      v-show="isSomethingSelected()"
      color="pink"
      position="fixed"
      bottom
      right
      fab
      variant="contained"
    >
      {{ selectedMedia.length }}
    </v-btn>
  </v-fab-transition> -->
  <div style="position: fixed; bottom: 10px; right: 10px">
    <v-row>
      <v-col cols="1">
        <v-btn
          v-show="isSomethingSelected()"
          color="primary"
          fab
          icon="mdi-pencil"
          variant="contained"
          @click="openDescriptionEditor(selectedMedia[0])"
        />
        <v-btn
          v-show="isSomethingSelected()"
          color="primary"
          fab
          icon="mdi-folder"
          variant="contained"
          @click="openAddToAlbumDialog(selectedMedia)"
        />
      </v-col>
    </v-row>
  </div>
  <v-dialog v-model="descriptionEditDialog">
    <v-card :title="t('dialogs.editDescription.title')">
      <v-card-text>
        <v-text-field
          v-model="descriptionEdit"
          :label="t('dialogs.editDescription.description')"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="descriptionEditDialog = false"
          >{{ t("general.cancel") }}</v-btn
        >
        <v-btn
          color="primary"
          variant="text"
          @click="
            descriptionEditDialog = false;
            changeDescription(selectedMedia[0]);
          "
          >{{ t("general.change") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="addToAlbumDialog">
    <v-card :title="t('dialogs.addToAlbum.title')">
      <v-card-text>
        <select v-model="selectedAlbumUuid">
          <option :value="undefined" disabled></option>
          <option
            v-for="album in fetchedMedia.albumList"
            :key="album.link"
            :value="album.link"
          >
            {{ album.name }}
          </option>
        </select>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="addToAlbumDialog = false"
          >{{ t("general.cancel") }}</v-btn
        >
        <v-btn color="primary" variant="text" disabled>{{
          t("general.add")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { defineComponent, PropType } from "vue";
import { useI18n } from "vue-i18n";

import ImageWrapper from "~/components/media/image-wrapper.vue";
import api from "~/composables/api";
import rfc3339 from "~/rfc3339";
import { useFetchedMediaStore } from "~/stores/fetched-media";
import { useSelectedMediaStore } from "~/stores/selected-media";

export default defineComponent({
  name: "MosaicView",
  components: { ImageWrapper },
  props: {
    mediaList: {
      type: Object as PropType<MediaResponse[]>,
      required: true,
    },
    loading: {
      type: String,
      required: false,
      default: "auto",
    },
  },
  setup() {
    const setMediaModal = useSelectedMediaStore().setMediaModal;

    const { d, t } = useI18n();

    const fetchedMedia = useFetchedMediaStore();

    return { d, fetchedMedia, t, setMediaModal };
  },

  data(): {
    mediaInfo: string | undefined;
    selectedMedia: string[];
    loaded: boolean;
    descriptionEditDialog: boolean;
    descriptionEdit: string | undefined;
    addToAlbumDialog: boolean;
    selectedAlbumUuid: number | undefined;
  } {
    return {
      mediaInfo: undefined,
      selectedMedia: [],
      loaded: false,
      descriptionEditDialog: false,
      descriptionEdit: undefined,
      addToAlbumDialog: false,
      selectedAlbumUuid: undefined,
    };
  },
  async created() {
    await this.fetchedMedia.getLikedMedia();

    this.loaded = true;
  },
  methods: {
    getMediaType() {
      return;
    },
    getLocalizedDate(date_taken: Date, d: string) {
      console.log(rfc3339(date_taken) + " vs " + d);
      return this.d(date_taken, "datetime");
    },
    likeToggle(media: MediaResponse) {
      if (this.isLiked(media.uuid)) {
        this.fetchedMedia.mediaUnlike(media.uuid);

        return;
      }

      this.fetchedMedia.mediaLike(media);
    },
    toggleInfo(mediaUuid: string) {
      if (this.mediaInfo != mediaUuid) {
        this.mediaInfo = mediaUuid;
        return;
      }

      this.mediaInfo = undefined;
    },
    showImage(media: MediaResponse) {
      this.setMediaModal(media);
    },
    mediaInfoIsActive(media_uuid: string): boolean {
      if (this.mediaInfo == media_uuid) {
        return true;
      }

      return false;
    },
    isLiked(mediaUuid: string): boolean {
      return (
        this.fetchedMedia.likedMedia?.some(
          (media) => media.uuid == mediaUuid
        ) ?? false
      );
    },
    toggleSelection(mediaUuid: string) {
      if (this.isSelected(mediaUuid)) {
        const index = this.selectedMedia.indexOf(mediaUuid);
        this.selectedMedia.splice(index, 1);
        return;
      }

      this.selectedMedia.push(mediaUuid);
    },
    isSelected(mediaUuid: string): boolean {
      return this.selectedMedia.includes(mediaUuid);
    },
    isSomethingSelected(): boolean {
      return this.selectedMedia.length > 0;
    },
    mediaClick(media: MediaResponse) {
      if (this.isSomethingSelected()) {
        this.toggleSelection(media.uuid);
        return;
      }

      this.showImage(media);
    },
    openDescriptionEditor(uuid: string) {
      this.descriptionEditDialog = !this.descriptionEditDialog;
      this.descriptionEdit =
        this.mediaList[this.selectedUuidToId(uuid)].description ?? "";
    },
    // may return -1, which is an invalid index
    selectedUuidToId(uuid: string): number {
      return this.mediaList.findIndex((media) => media.uuid == uuid);
    },
    async changeDescription(uuid: string) {
      const success = await api()
        .routesMediaUpdateDescription({
          mediaUuid: uuid,
          mediaDescription: { description: this.descriptionEdit },
        })
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });

      if (success) {
        const selectedItem = this.selectedUuidToId(uuid);

        if (selectedItem > -1 && this.mediaList[selectedItem]) {
          // TODO: refactor this later
          // eslint-disable-next-line vue/no-mutating-props
          this.mediaList[selectedItem].description = this.descriptionEdit;
        }
      }
    },
    openAddToAlbumDialog(mediaUuidList: string[]) {
      this.addToAlbumDialog = !this.addToAlbumDialog;

      this.fetchedMedia.getAlbumList();

      // TODO: finish later
    },
  },
});
</script>

<style scoped>
img {
  height: 200px;
  float: left;
}

.media-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 2rem auto;
  width: calc(95% - 0.5rem);
}

.displayNone {
  display: none;
}

.visible {
  visibility: visible;
}

.mediaInfo {
  display: unset;
  filter: brightness(75%) blur(5px);
  opacity: 0.5;
}

div.image-inner {
  visibility: hidden;
  position: absolute;
  inset: 0;
}

.img-overlay {
  background-color: rgba(128, 128, 128, 0.75);
}

div.image-inner-relative {
  position: relative;
  width: 100%;
  height: 100%;
}

.media {
  position: relative;
}

.media > * {
  flex: 1;
}

div.media:hover > div.image-inner {
  visibility: visible;
}

/* .mediaSelected {
  border: 4px solid lightseagreen;
} */
</style>
