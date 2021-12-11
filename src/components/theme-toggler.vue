<template>
  <v-container>
    <v-btn color="primary" @click="userPreferences.toggleDarkMode"
      >switch to {{ userPreferences.darkMode ? "light" : "dark" }} theme</v-btn
    >
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useUserPreferencesStore } from "~/stores/user-preferences";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "ThemeToggler",
});
</script>

<script setup lang="ts">
const userPreferences = useUserPreferencesStore();
</script>
