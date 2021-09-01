<template>
  <div class="media">
    <img :loading="loading" />
    <div class="image-inner">
      <div class="image-inner-relative">
        <span style="display: none">{{
          getLocalizedDate(new Date(media.date_taken), media.date_taken)
        }}</span>
        <v-icon
          v-if="liked"
          color="red"
          class="mb-2 like"
          @click="
            like(media.uuid);
            liked = !liked;
          "
          >mdi-heart</v-icon
        >
        <v-icon
          v-if="!liked"
          color="grey"
          class="mb-2 like"
          @click="
            like(media.uuid);
            liked = !liked;
          "
          >mdi-heart-outline</v-icon
        >
        <v-icon color="grey" class="mb-2 info" @click="toggleInfo()">
          mdi-information-outline
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MediaResponse as Media } from "@galera/client-axios";
import { defineComponent, PropType, ref } from "vue";
import { useI18n } from "vue-i18n";

import api from "~/composables/api";
import rfc3339 from "~/rfc3339";

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
    const { d } = useI18n();
    const liked = ref(false);
    return { d, liked };
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
      console.log(media_id);
    },
    toggleInfo() {
      let info = this.$el.querySelector("span");

      switch (info.style.display) {
        case "none":
          info.style.display = "unset";
          break;
        default:
          info.style.display = "none";
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
  },
});
</script>

<style scoped>
div.image-inner {
  visibility: hidden;
  position: absolute;
  inset: 0;
}

div.image-inner-relative {
  position: relative;
  width: 100%;
  height: 100%;
}

i {
  position: absolute; /* absolute prop doesn't seem to work */
  background-color: transparent;
}

i.info {
  top: 2vh;
  right: 2vh;
}

i.like {
  bottom: 2vh;
  left: 2vh;
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
