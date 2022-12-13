<template>
  <v-container>
    <ViewWrapper
      v-if="albumMedia && albumMedia.length > 0"
      :media-list="albumMedia"
    />
    <v-alert v-else type="info" variant="tonal">
      {{ t("noContent.album") }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { Ref, ref } from "vue";
import { useI18n } from "vue-i18n";

import ViewWrapper from "~/components/view-wrapper.vue";
import { useFetchedMediaStore } from "~/stores/fetched-media";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const fetchedMedia = useFetchedMediaStore();

const albumMedia: Ref<MediaResponse[] | undefined> = ref();

// eslint-disable-next-line promise/catch-or-return, unicorn/prefer-top-level-await
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
