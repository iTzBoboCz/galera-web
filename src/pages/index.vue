<template>
  <MosaicView :mediaList="allMedia" />
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

    const { allMedia } = useState(["allMedia"]);

    const { numberOfAllMedia } = useGetters(["numberOfAllMedia"]);

    const { getAllMedia } = useActions(["getAllMedia"]);

    return { allMedia, getAllMedia, numberOfAllMedia };
  },
  created() {
    this.getAllMedia();
  },
});
</script>
