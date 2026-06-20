<template>
  <v-btn
    :icon="isLiked() ? 'mdi-heart' : 'mdi-heart-outline'"
    variant="text"
    :color="isLiked() == null ? undefined : props.color"
    :disabled="isLiked() == null"
    @click.stop="likeToggle"
  />
</template>

<script setup lang="ts">
import type { MediaResponse } from "@galera/client-axios";
import type { PropType } from "vue";

import { useFetchedMediaStore } from "~/stores/fetched-media";

defineOptions({
  name: "LikeButton",
});

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
  color: {
    type: String,
    default: undefined,
  },
});

const fetchedMedia = useFetchedMediaStore();
</script>
