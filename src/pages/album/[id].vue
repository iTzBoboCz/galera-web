@@ -1,17 +1,44 @@
<template>
  <MosaicView :mediaList="mediaList" />
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { AxiosResponse } from "axios";
import { defineComponent } from "vue";

import MosaicView from "~/components/views/mosaic-view.vue";
import api from "~/composables/api";

export default defineComponent({
  components: { MosaicView },
  props: {
    id: {
      type: String,
      required: false,
      default: "d",
    },
  },
  data(): { mediaList: MediaResponse[] } {
    return {
      mediaList: [],
    };
  },
  async created() {
    this.mediaList = await this.getAlbumMedia().then((response) => {
      return response.data;
    });

    for (const data of this.mediaList) {
      console.log(data.uuid);
    }
  },
  methods: {
    async getAlbumMedia(): Promise<AxiosResponse<MediaResponse[]>> {
      return api.routesGetAlbumStructure({ albumUuid: this.id });
    },
  },
});
</script>
