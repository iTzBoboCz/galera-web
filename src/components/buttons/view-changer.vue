<template>
  <v-btn icon @click="userPreferences.nextView">
    <v-icon v-if="userPreferences.view == 'tile'">mdi-view-quilt</v-icon>
    <v-icon v-else-if="userPreferences.view == 'list'">mdi-view-grid</v-icon>
    <v-icon v-else>mdi-view-list</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { useUserPreferencesStore } from "~/stores/user-preferences";

defineOptions({
  name: "ViewChanger",
});

const userPreferences = useUserPreferencesStore();
</script>
