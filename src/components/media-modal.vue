<template>
  <div id="media-modal" @click="selectedMedia.setMediaModal(undefined)">
    <v-btn
      position="absolute"
      size="large"
      class="arrow"
      left="2vh"
      icon="mdi-arrow-left"
      variant="text"
      @click.stop
    />
    <ImageWrapper
      v-if="selectedMedia.mediaModal"
      :media="selectedMedia.mediaModal"
      @click.stop
    />
    <span v-if="selectedMedia.mediaModal?.description">{{
      selectedMedia.mediaModal.description
    }}</span>
    <v-btn
      position="absolute"
      size="large"
      class="arrow"
      right="2vh"
      icon="mdi-arrow-right"
      variant="text"
      @click.stop
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ImageWrapper from "~/components/media/image-wrapper.vue";
import { useSelectedMediaStore } from "~/stores/selected-media";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "MediaModal",
});
</script>

<script setup lang="ts">
const selectedMedia = useSelectedMediaStore();
</script>

<style scoped>
#media-modal {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: grey;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  top: 0;
  overflow: hidden;
  z-index: 1000;
}

img {
  margin: 0 auto;
  max-height: 80vh;
  max-width: 80vw;
}
</style>
