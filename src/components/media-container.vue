<template>
  <div class="media">
    <img :loading="loading" />
    <div class="image-inner">
      <div class="image-inner-relative" @click="showImage(media.uuid)">
        <span style="display: none">{{
          getLocalizedDate(new Date(media.date_taken), media.date_taken)
        }}</span>
        <!-- TODO: fix later; absolute prop doesn't seem to work yet -->
        <v-btn
          icon
          position="absolute"
          bottom="1.5vh"
          left="1.5vh"
          color="red"
          variant="text"
          @click.stop="like(media.uuid)"
        >
          <v-icon v-if="liked" color="red">mdi-heart</v-icon>
          <v-icon v-if="!liked" color="grey">mdi-heart-outline</v-icon>
        </v-btn>
        <v-btn
          icon="mdi-information-outline"
          position="absolute"
          top="1.5vh"
          right="1.5vh"
          color="grey"
          variant="text"
          @click.stop="toggleInfo()"
        />
        <v-btn
          icon
          position="absolute"
          bottom="1.5vh"
          right="1.5vh"
          color="blue"
          variant="text"
          @click.stop=""
        >
          <v-icon v-if="!liked" color="grey"
            >mdi-checkbox-blank-circle-outline</v-icon
          >
          <v-icon v-if="liked" color="blue">mdi-checkbox-blank-circle</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MediaResponse as Media } from "@galera/client-axios";
import { AxiosResponse } from "axios";
import { defineComponent, PropType, ref } from "vue";
import { useI18n } from "vue-i18n";
import { createNamespacedHelpers } from "vuex-composition-helpers";

import api from "~/composables/api";
import rfc3339 from "~/rfc3339";

import { useStore } from "../store";

export default defineComponent({
  name: "MediaContainer",
  props: {
    media: {
      type: Object as PropType<Media>,
      required: true,
    },
    loading: {
      type: String,
      required: false,
      default: "auto",
    },
  },
  setup() {
    const store = useStore();
    const { useActions } = createNamespacedHelpers(store, "selectedMedia");
    const { setMediaModal } = useActions(["setMediaModal"]);

    const { d } = useI18n();

    const liked = ref(false);

    return { d, liked, setMediaModal };
  },
  data() {
    return {
      imageBlob: {},
    };
  },
  created() {
    this.getMediaByUuid(this.media.uuid);
  },
  methods: {
    getMediaType() {
      return;
    },
    getLocalizedDate(date_taken: Date, d: string) {
      console.log(rfc3339(date_taken) + " vs " + d);
      return this.d(date_taken, "datetime");
    },
    like(media_id: string) {
      this.liked = !this.liked;
      console.log(media_id);
    },
    toggleInfo() {
      let info: HTMLSpanElement = this.$el.querySelector("span");
      let img: HTMLImageElement = this.$el.querySelector("img");
      switch (info.style.display) {
        case "none":
          info.style.display = "unset";
          img.style.filter = "brightness(75%) blur(5px)";
          img.style.opacity = "0.5";
          break;
        default:
          info.style.display = "none";
          img.style.filter = "";
          img.style.opacity = "";
      }
    },
    async getMediaByUuid(media_uuid: string) {
      let d = api
        .routesGetMediaByUuid(
          { mediaUuid: media_uuid },
          { responseType: "blob" }
        )
        .then((response) => {
          let image = this.$el.querySelector("img");
          image.src = URL.createObjectURL(response.data);
          return URL.createObjectURL(response.data);
          // return window.URL.createObjectURL(response.data);
        });
    },
    showImage(media_uuid: string) {
      this.setMediaModal({ mediaModal: media_uuid });
    },
  },
});
</script>

<style scoped>
div.image-inner {
  visibility: hidden;
  position: absolute;
  inset: 0;
}

.img-overlay {
  background-color: rgba(128, 128, 128, 0.75);
}

div.image-inner-relative {
  position: relative;
  width: 100%;
  height: 100%;
}

.media {
  position: relative;
}

.media > * {
  flex: 1;
}

div.media:hover > div.image-inner {
  visibility: visible;
}
</style>
