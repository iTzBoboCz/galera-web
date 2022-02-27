<template>
  <v-table>
    <thead>
      <tr>
        <th></th>
        <th>{{ t("media.description") }}</th>
        <th>{{ t("media.dateTaken") }}</th>
        <th>{{ t("media.fileName") }}</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="media in mediaList" :key="media.filename">
        <td>
          <v-hover
            v-slot="{ isHovering, props }"
            :model-value="isMediaSelected(media.uuid) ? true : undefined"
          >
            <v-card v-bind="props" @click="setMediaModal(media)">
              <ImageWrapper :media="media" :aspect-ratio="1" />
              <!-- TODO: remove scroll-strategy prop in the future, because it might default to reposition -->
              <!-- TODO: width and height might not be needed in the future too -->
              <v-overlay
                :model-value="isHovering"
                contained
                width="100%"
                height="100%"
                scroll-strategy="reposition"
                scrim="black"
              />
            </v-card>
          </v-hover>
        </td>
        <td>{{ media.description }}</td>
        <td>
          {{ d(new Date(media.date_taken), "datetime") }}
        </td>
        <td>{{ media.filename }}</td>
        <td>
          <v-btn
            icon
            color="white"
            variant="text"
            @click.stop="
              isMediaSelected(media.uuid)
                ? emit('unselectMedia', media)
                : emit('selectMedia', media)
            "
          >
            <v-icon v-if="isMediaSelected(media.uuid)">
              mdi-check-circle
            </v-icon>
            <v-icon v-else> mdi-checkbox-blank-circle-outline </v-icon>
          </v-btn>
          <LikeButton :media="media" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { defineComponent, PropType } from "vue";
import { useI18n } from "vue-i18n";

import LikeButton from "~/components/buttons/like-button.vue";
import ImageWrapper from "~/components/media/image-wrapper.vue";
import { useSelectedMediaStore } from "~/stores/selected-media";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "ListView",
});
</script>

<script setup lang="ts">
const props = defineProps({
  mediaList: {
    type: Object as PropType<MediaResponse[]>,
    required: true,
  },
  selectedMedia: {
    type: Object as PropType<MediaResponse[]>,
    required: true,
  },
});

const { d, t } = useI18n();

const emit = defineEmits(["selectMedia", "unselectMedia"]);

const setMediaModal = useSelectedMediaStore().setMediaModal;

function isMediaSelected(mediaUuid: string): boolean {
  return props.selectedMedia.some((media) => media.uuid == mediaUuid) ?? false;
}
</script>
