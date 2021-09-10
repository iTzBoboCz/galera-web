<template>
  <div v-if="isShown()" id="media-modal" @click="setMediaModal({})">
    <v-btn
      size="large"
      class="arrow"
      style="left: 2vh"
      icon="mdi-arrow-left"
      variant="default"
      @click.stop
    />
    <img :src="getMediaByUuid(mediaModal)" @click.stop />
    <v-text-field @click.stop v-text="mediaModal" />
    <v-btn
      size="large"
      class="arrow"
      style="right: 2vh"
      icon="mdi-arrow-right"
      variant="default"
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
  methods: {
    isShown(): boolean {
      if (!this.mediaModal) {
        return false;
      }

      return true;
    },
    async getMediaByUuid(media_uuid: string) {
      api
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
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: grey;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  top: 0;
}

img {
  margin: 0 auto;
}

/* TODO: use absolute prop when it is implemented */
.arrow {
  position: absolute;
}
</style>
