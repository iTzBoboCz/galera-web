@@ -0,0 +1,289 @@
<template>
  <div v-if="loaded" class="media-container">
    <div
      v-for="media in mediaList"
      :key="media.filename"
      class="media"
      loading="lazy"
    >
      <ImageWrapper
        :media-uuid="media.uuid"
        :class="{ mediaInfo: mediaInfoIsActive(media.uuid) }"
      />
      <div class="image-inner">
        <div class="image-inner-relative" @click="mediaClick(media.uuid)">
          <span :class="{ displayNone: !mediaInfoIsActive(media.uuid) }">{{
            getLocalizedDate(new Date(media.date_taken), media.date_taken)
          }}</span>
          <!-- TODO: fix later; absolute prop doesn't seem to work yet -->
          <v-btn
            icon
            bottom="1.5vh"
            left="1.5vh"
            color="red"
            variant="text"
            position="absolute"
            @click.stop="likeToggle(media.uuid)"
          >
            <v-icon v-if="isLiked(media.uuid)" color="red">mdi-heart</v-icon>
            <v-icon v-if="!isLiked(media.uuid)" color="grey"
              >mdi-heart-outline</v-icon
            >
          </v-btn>
          <v-btn
            icon="mdi-information-outline"
            top="1.5vh"
            right="1.5vh"
            color="grey"
            variant="text"
            position="absolute"
            @click.stop="toggleInfo(media.uuid)"
          />
          <v-btn
            icon
            bottom="1.5vh"
            right="1.5vh"
            color="blue"
            variant="text"
            position="absolute"
            :class="{ visible: isSomethingSelected() }"
            @click.stop="toggleSelection(media.uuid)"
          >
            <v-icon v-if="!isSelected(media.uuid)" color="grey"
              >mdi-checkbox-blank-circle-outline</v-icon
            >
            <v-icon v-if="isSelected(media.uuid)" color="blue"
              >mdi-checkbox-blank-circle</v-icon
            >
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { defineComponent, PropType } from "vue";
import { useI18n } from "vue-i18n";

import ImageWrapper from "~/components/media/image-wrapper.vue";
import api from "~/composables/api";
import rfc3339 from "~/rfc3339";
import { useSelectedMediaStore } from "~/stores/selected-media";

export default defineComponent({
  name: "MosaicView",
  components: { ImageWrapper },
  props: {
    mediaList: {
      type: Object as PropType<MediaResponse[]>,
      required: true,
    },
    loading: {
      type: String,
      required: false,
      default: "auto",
    },
  },
  setup() {
    const setMediaModal = useSelectedMediaStore().setMediaModal;

    const { d } = useI18n();

    return { d, setMediaModal };
  },

  data(): {
    mediaInfo: string | undefined;
    likedMedia: string[];
    selectedMedia: string[];
    loaded: boolean;
  } {
    return {
      mediaInfo: undefined,
      likedMedia: [],
      selectedMedia: [],
      loaded: false,
    };
  },
  async created() {
    this.likedMedia = await api()
      .routesGetMediaLikedList()
      .then((response) => {
        let media: string[] = [];

        for (const m of response.data) {
          media.push(m.uuid);
        }

        return media;
      });

    this.loaded = true;
  },
  methods: {
    getMediaType() {
      return;
    },
    getLocalizedDate(date_taken: Date, d: string) {
      console.log(rfc3339(date_taken) + " vs " + d);
      return this.d(date_taken, "datetime");
    },
    likeToggle(mediaUuid: string) {
      if (this.isLiked(mediaUuid)) {
        const index = this.likedMedia.indexOf(mediaUuid);

        // TODO: fix CORS and add .then() and .catch()
        // https://stackoverflow.com/questions/54540881/why-does-my-instance-of-axios-not-return-the-response-in-a-caught-error
        api().routesMediaUnlike({ mediaUuid });
        this.likedMedia.splice(index, 1);
        return;
      }

      api().routesMediaLike({ mediaUuid });
      this.likedMedia.push(mediaUuid);
    },
    toggleInfo(mediaUuid: string) {
      if (this.mediaInfo != mediaUuid) {
        this.mediaInfo = mediaUuid;
        return;
      }

      this.mediaInfo = undefined;
    },
    showImage(mediaUuid: string) {
      this.setMediaModal(mediaUuid);
    },
    mediaInfoIsActive(media_uuid: string): boolean {
      if (this.mediaInfo == media_uuid) {
        return true;
      }

      return false;
    },
    isLiked(mediaUuid: string): boolean {
      return this.likedMedia.includes(mediaUuid);
    },
    toggleSelection(mediaUuid: string) {
      if (this.isSelected(mediaUuid)) {
        const index = this.selectedMedia.indexOf(mediaUuid);
        this.selectedMedia.splice(index, 1);
        return;
      }

      this.selectedMedia.push(mediaUuid);
    },
    isSelected(mediaUuid: string): boolean {
      return this.selectedMedia.includes(mediaUuid);
    },
    isSomethingSelected(): boolean {
      return this.selectedMedia.length > 0;
    },
    mediaClick(mediaUuid: string) {
      if (this.isSomethingSelected()) {
        this.toggleSelection(mediaUuid);
        return;
      }

      this.showImage(mediaUuid);
    },
  },
});
</script>

<style scoped>
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

.displayNone {
  display: none;
}

.visible {
  visibility: visible;
}

.mediaInfo {
  display: unset;
  filter: brightness(75%) blur(5px);
  opacity: 0.5;
}

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

/* .mediaSelected {
  border: 4px solid lightseagreen;
} */
</style>
