<template>
  <MosaicView :media-list="mediaList" />
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { AxiosResponse } from "axios";
import { defineComponent } from "vue";

import MosaicView from "~/components/views/mosaic-view.vue";
import api from "~/composables/api";

export default defineComponent({
  components: {
    MosaicView,
  },
  data(): { mediaList: MediaResponse[] } {
    return {
      mediaList: [],
    };
  },
  async created() {
    this.mediaList = await this.getPictureList().then((response) => {
      return response.data;
    });
  },
  methods: {
    async getPictureList(): Promise<AxiosResponse<MediaResponse[]>> {
      return api.routesGetMediaLikedList();
    },
  },
});
</script>
