@@ -0,0 +1,289 @@
<template>
  <div class="media-container">
    <div
      v-for="media in mediaList"
      :key="media.filename"
      class="media"
      loading="lazy"
    >
      <ImageWrapper :media="media" />
      <div class="image-inner">
        <div class="image-inner-relative" @click="mediaClick(media)">
          <v-btn
            icon
            color="white"
            position="absolute"
            top="1vh"
            left="1vh"
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
          <!-- TODO: reconsider later -->
          <!-- <v-btn
            icon="mdi-information-outline"
            top="1vh"
            right="1vh"
            color="white"
            variant="text"
            position="absolute"
          /> -->
          <LikeButton
            :media="media"
            style="position: absolute; bottom: 1vh; left: 1vh"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { defineComponent, PropType } from "vue";
import { useI18n } from "vue-i18n";

import LikeButton from "~/components/buttons/like-button.vue";
import ImageWrapper from "~/components/media/image-wrapper.vue";
import { useSelectedMediaStore } from "~/stores/selected-media";

export default defineComponent({
  name: "MosaicView",
  components: { ImageWrapper, LikeButton },
  setup() {
    const { t } = useI18n();

    return { t };
  },
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
