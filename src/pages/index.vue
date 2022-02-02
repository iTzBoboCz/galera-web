<template>
  <ViewWrapper :media-list="fetchedMedia.allMedia ?? []" />
</template>

<script setup lang="ts">
import ViewWrapper from "~/components/view-wrapper.vue";
import { useFetchedMediaStore } from "~/stores/fetched-media";

const fetchedMedia = useFetchedMediaStore();

// TODO: pass numberOfAllMedia later

fetchedMedia.getAllMedia();
</script>
