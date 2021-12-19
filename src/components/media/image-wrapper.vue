@@ -0,0 +1,42 @@
<template>
  <img />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import api from "~/composables/api";

export default defineComponent({
  name: "ImageWrapper",
  props: {
    mediaUuid: {
      type: String,
      required: true,
    },
  },
  created() {
    this.getMediaByUuid(this.mediaUuid);
  },
  methods: {
    async getMediaByUuid(media_uuid: string) {
      let d = api()
        .routesGetMediaByUuid(
          { mediaUuid: media_uuid },
          { responseType: "blob" }
        )
        .then((response) => {
          this.$el.src = URL.createObjectURL(response.data);
          return URL.createObjectURL(response.data);
        });
    },
  },
});
</script>
