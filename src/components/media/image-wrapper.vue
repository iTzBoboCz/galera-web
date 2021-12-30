@@ -0,0 +1,42 @@
<template>
  <img />
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { AxiosResponse } from "axios";
import { defineComponent, PropType } from "vue";

import api from "~/composables/api";

export default defineComponent({
  name: "ImageWrapper",
  props: {
    media: {
      type: Object as PropType<MediaResponse>,
      required: true,
    },
  },
  created() {
    this.getMediaByUuid(this.media.uuid);
  },
  methods: {
    async getMediaByUuid(mediaUuid: string) {
      const response = await api()
        .routesGetMediaByUuid({ mediaUuid }, { responseType: "blob" })
        // TODO: remove response type when this gets typed directly
        .then((response: AxiosResponse<File | void>) => {
          return response.data;
        })
        .catch(() => {
          return;
        });

      if (response) {
        // Looks like this is cheaper than using a reactive variable
        this.$el.src = URL.createObjectURL(response);
      }
    },
  },
});
</script>
