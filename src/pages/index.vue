<template>
  <v-container>
    <ViewWrapper
      v-if="fetchedMedia.allMedia && fetchedMedia.allMedia.length > 0"
      :media-list="fetchedMedia.allMedia"
    />
    <v-alert v-else type="info" variant="contained-text">
      {{ t("noContent.all") }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

import ViewWrapper from "~/components/view-wrapper.vue";
import { useFetchedMediaStore } from "~/stores/fetched-media";

const { t } = useI18n();

const fetchedMedia = useFetchedMediaStore();

// TODO: pass numberOfAllMedia later

fetchedMedia.getAllMedia();

fetchedMedia.getLikedMedia();
</script>
