<template>
  <TileView v-if="userPreferences.view == 'tile'" :media-list="mediaList" />
  <ListView
    v-else-if="userPreferences.view == 'list'"
    :media-list="mediaList"
  />
  <MosaicView v-else :media-list="mediaList" />
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { defineComponent, PropType } from "vue";

import ListView from "~/components/views/list-view.vue";
import MosaicView from "~/components/views/mosaic-view.vue";
import TileView from "~/components/views/tile-view.vue";
import { useUserPreferencesStore } from "~/stores/user-preferences";

export default defineComponent({
  name: "ViewWrapper",
});
</script>

<script setup lang="ts">
const userPreferences = useUserPreferencesStore();

defineProps({
  mediaList: {
    type: Object as PropType<MediaResponse[]>,
    required: true,
  },
});
</script>
