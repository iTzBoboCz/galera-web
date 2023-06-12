<template>
  <v-row dense>
    <v-col
      v-for="media in mediaList"
      :key="media.filename"
      cols="4"
      lg="1"
      md="2"
      sm="3"
    >
      <!-- FIX: overlay is broken when you click outside -->
      <v-hover v-slot="hoverProps">
        <v-card v-bind="hoverProps.props" @click="mediaClick(media)">
          <ImageWrapper
            :media="media"
            :aspect-ratio="1"
            :album-share-link-auth="props.albumShareLinkAuth"
          />
          <!-- TODO: remove scroll-strategy prop in the future, because it might default to reposition -->
          <!-- TODO: width and height might not be needed in the future too -->
          <v-overlay
            :model-value="hoverProps.isHovering || isMediaSelected(media.uuid)"
            contained
            width="100%"
            height="100%"
            scroll-strategy="reposition"
            scrim="black"
            class="align-center justify-center"
          >
            <v-btn
              icon
              color="white"
              position="absolute"
              variant="text"
              @click.stop="
                isMediaSelected(media.uuid)
                  ? emit('unselectMedia', media)
                  : emit('selectMedia', media)
              "
            >
              <v-icon v-if="isMediaSelected(media.uuid)">
                mdi-check-circle
              </v-icon>
              <v-icon v-else> mdi-checkbox-blank-circle-outline </v-icon>
            </v-btn>
            <LikeButton
              :media="media"
              color="white"
              style="position: absolute; bottom: 0; left: 0"
            />
          </v-overlay>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { defineComponent, PropType } from "vue";

import LikeButton from "~/components/buttons/like-button.vue";
import ImageWrapper from "~/components/media/image-wrapper.vue";
import { AlbumShareLinkScheme } from "~/composables/api";
import { useSelectedMediaStore } from "~/stores/selected-media";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "TileView",
});
</script>

<script setup lang="ts">
const props = defineProps({
  mediaList: {
    type: Object as PropType<MediaResponse[]>,
    required: true,
  },
  selectedMedia: {
    type: Object as PropType<MediaResponse[]>,
    required: true,
  },
  albumShareLinkAuth: {
    type: Object as PropType<AlbumShareLinkScheme>,
    default: undefined,
  },
});

const emit = defineEmits(["selectMedia", "unselectMedia"]);

const setMediaModal = useSelectedMediaStore().setMediaModal;

function isMediaSelected(mediaUuid: string): boolean {
  return props.selectedMedia.some((media) => media.uuid == mediaUuid) ?? false;
}

// TODO: deduplicate
function isSomethingSelected(): boolean {
  return props.selectedMedia.length > 0;
}

// TODO: deduplicate
function mediaClick(media: MediaResponse) {
  if (isSomethingSelected()) {
    isMediaSelected(media.uuid)
      ? emit("unselectMedia", media)
      : emit("selectMedia", media);

    return;
  }

  setMediaModal(media);
}
</script>
