<template>
  <v-app :theme="darkMode ? 'dark' : 'light'">
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";

import { useUserPreferencesStore } from "~/stores/user-preferences";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "App",
});
</script>
¨
<script setup lang="ts">
const userPreferences = useUserPreferencesStore();
const { darkMode } = storeToRefs(userPreferences);
</script>
