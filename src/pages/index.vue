<template>
  <div class="media-container">
    <MediaContainer
      v-for="m in media"
      :key="m.filename"
      :media="m"
      loading="lazy"
    />
  </div>
  <MediaModal />
</template>

<script lang="ts">
import { MediaResponse as Media } from "@galera/client-axios";
import axios, { AxiosResponse } from "axios";
import { defineComponent } from "vue";

import MediaContainer from "~/components/media-container.vue";
import MediaModal from "~/components/media-modal.vue";
import api from "~/composables/api";

export default defineComponent({
  components: {
    MediaContainer,
    MediaModal,
  },
  data(): { media: Media[] } {
    return {
      media: [],
    };
  },
  async created() {
    this.media = await this.getPictureList().then((response) => {
      return response.data;
    });
  },
  methods: {
    async getPictureList(): Promise<AxiosResponse<Media[]>> {
      return api.routesMediaStructure();
      // return this.axios.get<Media[]>("/api/media/");
    },
  },
});
</script>

<style>
img {
  height: 200px;
  float: left;
}
.media-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 2rem auto;
  width: calc(95% - 0.5rem);
}
</style>
