<template>
  <MosaicView :media-list="likedMedia" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers";

import MosaicView from "~/components/views/mosaic-view.vue";
import { useStore } from "~/store/index";

export default defineComponent({
  components: {
    MosaicView,
  },
  setup() {
    const store = useStore();

    const { useActions, useGetters, useState } = createNamespacedHelpers(
      store,
      "fetchedMedia"
    );

    const { likedMedia } = useState(["likedMedia"]);

    const { numberOfLikedMedia } = useGetters(["numberOfLikedMedia"]);

    const { getLikedMedia } = useActions(["getLikedMedia"]);

    return { likedMedia, getLikedMedia, numberOfLikedMedia };
  },
  created() {
    this.getLikedMedia();
  },
});
</script>
