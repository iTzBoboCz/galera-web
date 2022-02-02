<template>
  <v-btn
    icon
    color="white"
    variant="text"
    :disabled="isLiked() == null"
    @click.stop="likeToggle"
  >
    <v-icon v-if="isLiked()" color="white">mdi-heart</v-icon>
    <v-icon v-else :color="isLiked() == null ? 'grey' : 'white'"
      >mdi-heart-outline</v-icon
    >
  </v-btn>
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { defineComponent, PropType } from "vue";

import { useFetchedMediaStore } from "~/stores/fetched-media";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "LikeButton",
});
</script>

<script setup lang="ts">
function isLiked(): boolean | undefined {
  if (!fetchedMedia.likedMedia) {
    console.warn(
      "LikeButton state is unknown. Please, load likedMedia (inside fetchedMedia store) first."
    );

    return;
  }

  return (
    fetchedMedia.likedMedia?.some((media) => media.uuid == props.media.uuid) ??
    false
  );
}

function likeToggle() {
  if (isLiked()) {
    fetchedMedia.mediaUnlike(props.media.uuid);

    return;
  }

  fetchedMedia.mediaLike(props.media);
}

const props = defineProps({
  media: {
    type: Object as PropType<MediaResponse>,
    required: true,
  },
});

const fetchedMedia = useFetchedMediaStore();
</script>
