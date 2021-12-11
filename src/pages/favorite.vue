<template>
  <MosaicView :media-list="fetchedMedia.likedMedia ?? []" />
</template>

<script setup lang="ts">
import MosaicView from "~/components/views/mosaic-view.vue";
import { useFetchedMediaStore } from "~/stores/fetched-media";

const fetchedMedia = useFetchedMediaStore();

fetchedMedia.getLikedMedia();
</script>
