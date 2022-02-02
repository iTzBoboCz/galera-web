<template>
  <v-row dense>
    <v-col
      v-for="media in mediaList"
      :key="media.filename"
      cols="4"
      lg="1"
      md="2"
      sm="3"
    ></v-col
  ></v-row>
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { defineComponent, PropType } from "vue";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "TileView",
});
</script>

<script setup lang="ts">
defineProps({
  mediaList: {
    type: Object as PropType<MediaResponse[]>,
    required: true,
  },
});
</script>
