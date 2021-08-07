<template>
  <div class="media-container">
    <img
      v-for="m in media"
      :key="m.filename"
      :src="'http://127.0.0.1:8000/media/' + m.uuid"
      loading="lazy"
    />
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from "axios";
import { defineComponent } from "vue";

interface Media {
  filename: string;
  owner_id: number;
  album_id: number | null;
  width: number;
  height: number;
  date_taken: Date;
  uuid: string;
}

export default defineComponent({
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
      return this.axios.get<Media[]>("/api/media/");
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
