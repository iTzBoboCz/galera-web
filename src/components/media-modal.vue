<template>
  <v-dialog
    v-model="selectedMedia.isModalActive"
    fullscreen
    @keydown.esc="selectedMedia.setMediaModal(undefined)"
    @click="selectedMedia.setMediaModal(undefined)"
  >
    <v-container>
      <v-row align-content="center" style="height: 100vh">
        <v-col cols="2" align-self="center" class="button-row">
          <!-- <v-btn
            v-if="!display.mobile.value"
            size="large"
            class="arrow"
            icon="mdi-arrow-left"
            variant="text"
            @click.stop
          /> -->
        </v-col>
        <v-col>
          <v-card>
            <!-- TODO: opravit; Lukášovy hodinky se špatně scalují -->
            <ImageWrapper
              v-if="selectedMedia.mediaModal"
              :media="selectedMedia.mediaModal"
              style="display: relative"
              @click.stop
            />
          </v-card>
          <v-card
            v-if="selectedMedia.mediaModal?.description"
            :text="selectedMedia.mediaModal.description"
            class="mt-1"
          />
        </v-col>
        <v-col cols="2" align-self="center" class="button-row">
          <!-- <v-btn
            v-if="!display.mobile.value"
            size="large"
            class="arrow"
            icon="mdi-arrow-right"
            variant="text"
            @click.stop
          /> -->
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useDisplay } from "vuetify";

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

const display = useDisplay();
</script>

<style scoped>
/* remove this when Vuetify fixes the sizes */
.v-img {
  max-height: 80vh;
}

.button-row {
  display: flex;
  justify-content: center;
}
</style>
