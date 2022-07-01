<template>
  <v-container>
    <ViewWrapper
      v-if="loaded && likedMedia && likedMedia.length > 0"
      :media-list="likedMedia"
    />
    <v-alert v-else-if="loaded" type="info" variant="tonal">
      {{ t("noContent.favorite") }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import ViewWrapper from "~/components/view-wrapper.vue";
import { useFetchedMediaStore } from "~/stores/fetched-media";

const { t } = useI18n();

const fetchedMedia = useFetchedMediaStore();

const loaded = ref(false);

// we need to cache this so the liked images remain there even after unliking
const likedMedia: MediaResponse[] = [];

// eslint-disable-next-line promise/catch-or-return
fetchedMedia.getLikedMedia().then(() => {
  if (fetchedMedia.likedMedia) {
    likedMedia.push(...fetchedMedia.likedMedia);
    loaded.value = true;
  }

  return;
});
</script>
