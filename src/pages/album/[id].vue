<template>
  <v-container>
    <ViewWrapper :media-list="albumMedia ?? []" />
  </v-container>
</template>

<script setup lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { Ref, ref } from "vue";

import ViewWrapper from "~/components/view-wrapper.vue";
import { useFetchedMediaStore } from "~/stores/fetched-media";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const fetchedMedia = useFetchedMediaStore();

const albumMedia: Ref<MediaResponse[] | undefined> = ref();

// eslint-disable-next-line promise/catch-or-return
fetchedMedia.getAlbumMedia(props.id).then(() => {
  if (fetchedMedia.albumList) {
    const index = fetchedMedia.albumList.findIndex(
      (album) => album.link == props.id
    );

    if (index > -1) {
      albumMedia.value = fetchedMedia.albumList[index].media;
    }
  }

  return;
});
</script>
