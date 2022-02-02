<template>
  <v-btn icon @click="userPreferences.nextView">
    <v-icon v-if="userPreferences.view == 'tile'">mdi-view-quilt</v-icon>
    <v-icon v-else-if="userPreferences.view == 'list'">mdi-view-grid</v-icon>
    <v-icon v-else>mdi-view-list</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useUserPreferencesStore } from "~/stores/user-preferences";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "ViewChanger",
});
</script>

<script setup lang="ts">
const userPreferences = useUserPreferencesStore();
</script>
