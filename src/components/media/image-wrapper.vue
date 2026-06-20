<template>
  <!-- TODO: add v-skeleton-loader when it is implemented -->
  <v-img
    v-if="imageSource"
    :src="imageSource"
    :aspect-ratio="aspectRatio"
    :cover="aspectRatio == 1"
  />
</template>

<script setup lang="ts">
import type { MediaResponse } from "@galera/api-client";
import { type PropType, type Ref, ref } from "vue";

import api, {
  type AlbumShareLinkScheme,
  defaultConfiguration,
} from "~/composables/api";

defineOptions({
  name: "ImageWrapper",
});

const props = defineProps({
  media: {
    type: Object as PropType<MediaResponse>,
    required: true,
  },
  aspectRatio: {
    type: Number,
    required: false,
    default: undefined,
  },
  albumShareLinkAuth: {
    type: Object as PropType<AlbumShareLinkScheme>,
    default: undefined,
  },
});

async function getMediaByUuid(mediaUuid: string): Promise<string | undefined> {
  const response = await api(defaultConfiguration(props.albumShareLinkAuth))
    .routesGetMediaByUuid({ mediaUuid })
    .then((response) => {
      return response;
    });

  if (response) {
    return URL.createObjectURL(response);
  }
}

const imageSource: Ref<string | undefined> = ref();

// eslint-disable-next-line promise/catch-or-return, unicorn/prefer-top-level-await
getMediaByUuid(props.media.uuid).then((url) => {
  // eslint-disable-next-line promise/always-return
  if (url) {
    imageSource.value = url;
  }
});
</script>
