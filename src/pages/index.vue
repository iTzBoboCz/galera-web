<template>
  <MosaicView :mediaList="fetchedMedia.allMedia ?? []" />
</template>

<script setup lang="ts">
import MosaicView from "~/components/views/mosaic-view.vue";
import { useFetchedMediaStore } from "~/stores/fetched-media";

const fetchedMedia = useFetchedMediaStore();

// TODO: pass numberOfAllMedia later

fetchedMedia.getAllMedia();
</script>
