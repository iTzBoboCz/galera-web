<template>
  <v-table></v-table>
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { defineComponent, PropType } from "vue";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "ListView",
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
