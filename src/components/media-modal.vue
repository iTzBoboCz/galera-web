<template>
  <div id="media-modal" @click="setMediaModal({})">
    <v-btn
      position="absolute"
      size="large"
      class="arrow"
      left="2vh"
      icon="mdi-arrow-left"
      variant="text"
      @click.stop
    />
    <img @click.stop />
    <span>{{ mediaModal }}</span>
    <v-btn
      position="absolute"
      size="large"
      class="arrow"
      right="2vh"
      icon="mdi-arrow-right"
      variant="text"
      @click.stop
    />
  </div>
</template>

<script lang="ts">
import { MediaResponse as Media } from "@galera/client-axios";
import { defineComponent } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers";

import api from "~/composables/api";

import { useStore } from "../store";

export default defineComponent({
  name: "MediaModal",
  setup() {
    const store = useStore();
    const { useActions, useGetters } = createNamespacedHelpers(
      store,
      "selectedMedia"
    );
    const { setMediaModal } = useActions(["setMediaModal"]);
    const { mediaModal } = useGetters(["mediaModal"]);

    return { mediaModal, setMediaModal };
  },
  created() {
    this.getMediaByUuid(this.mediaModal);
  },
  methods: {
    async getMediaByUuid(media_uuid: string) {
      return api
        .routesGetMediaByUuid(
          { mediaUuid: media_uuid },
          { responseType: "blob" }
        )
        .then((response) => {
          let image = this.$el.querySelector("img");
          image.src = URL.createObjectURL(response.data);
          return URL.createObjectURL(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
</script>

<style scoped>
#media-modal {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: grey;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  top: 0;
  overflow: hidden;
  z-index: 1000;
}

img {
  margin: 0 auto;
  max-height: 80vh;
  max-width: 80vw;
}
</style>
