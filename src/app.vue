<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, watchEffect } from "vue";
import { useTheme } from "vuetify";

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

const theme = useTheme();

watchEffect(() => {
  theme.global.name.value = userPreferences.darkMode ? "dark" : "light";
});
</script>

<style>
/* temporary Vuetify fixes */
.v-container {
  min-height: 100vh;
}
</style>
