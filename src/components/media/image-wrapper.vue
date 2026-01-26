<template>
  <!-- TODO: add v-skeleton-loader when it is implemented -->
  <v-img
    v-if="imageSource"
    :src="imageSource"
    :aspect-ratio="aspectRatio"
    :cover="aspectRatio == 1"
  />
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { AxiosResponse } from "axios";
import { defineComponent, PropType, Ref, ref } from "vue";

import api, {
  AlbumShareLinkScheme,
  defaultConfiguration,
} from "~/composables/api";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "ImageWrapper",
});
</script>

<script setup lang="ts">
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
    .routesGetMediaByUuid({ mediaUuid }, { responseType: "blob" })
    // TODO: remove response type when this gets typed directly
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return;
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
