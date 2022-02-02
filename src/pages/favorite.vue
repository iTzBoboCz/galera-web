<template>
  <ViewWrapper :media-list="likedMedia ?? []" />
</template>

<script setup lang="ts">
import ViewWrapper from "~/components/view-wrapper.vue";
import { useFetchedMediaStore } from "~/stores/fetched-media";

const fetchedMedia = useFetchedMediaStore();

fetchedMedia.getLikedMedia();

// we need to cache this so the liked images remain there even after unliking
const likedMedia = fetchedMedia.likedMedia;
</script>
