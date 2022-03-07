<template>
  <TileView
    v-if="userPreferences.view == 'tile'"
    v-model:selected-media="selectedMedia"
    :media-list="mediaList"
    :album-share-link-auth="props.albumShareLinkAuth"
    @select-media="selectMedia"
    @unselect-media="unselectMedia"
  />
  <ListView
    v-else-if="userPreferences.view == 'list'"
    v-model:selected-media="selectedMedia"
    :media-list="mediaList"
    :album-share-link-auth="props.albumShareLinkAuth"
    @select-media="selectMedia"
    @unselect-media="unselectMedia"
  />
  <MosaicView
    v-else
    v-model:selected-media="selectedMedia"
    :media-list="mediaList"
    :album-share-link-auth="props.albumShareLinkAuth"
    @select-media="selectMedia"
    @unselect-media="unselectMedia"
  />
  <!-- TODO: refactor this when v-speed-dial gets released -->
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
          @click="openDescriptionEditor(selectedMedia[0].uuid)"
        />
        <v-btn
          v-show="isSomethingSelected()"
          color="primary"
          fab
          icon="mdi-folder"
          variant="contained"
          @click="openAddToAlbumDialog()"
        />
      </v-col>
    </v-row>
  </div>
  <!-- TODO: put dialogs into separate components -->
  <v-dialog v-model="descriptionEditDialog">
    <v-card :title="t('dialogs.editDescription.title')">
      <v-card-text>
        <v-text-field
          v-model="newDescription"
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
            changeMediaDescription(selectedMedia[0].uuid, newDescription);
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
        <v-btn
          color="primary"
          variant="text"
          :disabled="!selectedAlbumUuid"
          @click="
            addToAlbumDialog = false;
            if (selectedAlbumUuid) {
              fetchedMedia.addMediaToAlbum(selectedAlbumUuid, selectedMedia);
            }
          "
          >{{ t("general.add") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { defineComponent, PropType, Ref, ref } from "vue";
import { useI18n } from "vue-i18n";

import ListView from "~/components/views/list-view.vue";
import MosaicView from "~/components/views/mosaic-view.vue";
import TileView from "~/components/views/tile-view.vue";
import api, { AlbumShareLinkScheme } from "~/composables/api";
import { useFetchedMediaStore } from "~/stores/fetched-media";
import { useUserPreferencesStore } from "~/stores/user-preferences";

export default defineComponent({
  name: "ViewWrapper",
});
</script>

<script setup lang="ts">
const userPreferences = useUserPreferencesStore();

const props = defineProps({
  mediaList: {
    type: Object as PropType<MediaResponse[]>,
    required: true,
  },
  albumShareLinkAuth: {
    type: Object as PropType<AlbumShareLinkScheme>,
    default: undefined,
  },
});

const { t } = useI18n();

const fetchedMedia = useFetchedMediaStore();

const selectedMedia: Ref<MediaResponse[]> = ref([]);

function selectMedia(media: MediaResponse) {
  const alreadyExists = selectedMedia.value.some((m) => m.uuid == media.uuid);

  if (!alreadyExists) {
    selectedMedia.value.push(media);
  }
}

function unselectMedia(media: MediaResponse) {
  const index = selectedMedia.value.findIndex((m) => m.uuid == media.uuid);
  if (index > -1) {
    selectedMedia.value.splice(index, 1);
  }
}

async function changeMediaDescription(mediaUuid: string, description: string) {
  const success = await api()
    .routesMediaUpdateDescription({
      mediaUuid,
      mediaDescription: { description },
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });

  if (success) {
    const index = selectedUuidToIndex(mediaUuid);

    if (index) {
      // TODO: refactor this later
      // eslint-disable-next-line vue/no-mutating-props
      props.mediaList[index].description = description;
    }
  }
}

function selectedUuidToIndex(mediaUuid: string): number | undefined {
  const index = props.mediaList.findIndex((media) => media.uuid == mediaUuid);

  return index > -1 ? index : undefined;
}

function openDescriptionEditor(uuid: string) {
  const index = selectedUuidToIndex(uuid);
  if (index == undefined) {
    return;
  }
  descriptionEditDialog.value = true;
  newDescription.value = props.mediaList[index].description ?? "";
}

function openAddToAlbumDialog() {
  addToAlbumDialog.value = true;
  selectedAlbumUuid.value = undefined;

  fetchedMedia.getAlbumList();
}

// TODO: deduplicate
function isSomethingSelected(): boolean {
  return selectedMedia.value.length > 0;
}

const descriptionEditDialog = ref(false);
const newDescription = ref("");
const addToAlbumDialog = ref(false);
const selectedAlbumUuid: Ref<string | undefined> = ref();
</script>
