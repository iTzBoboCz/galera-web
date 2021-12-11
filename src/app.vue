<template>
  <div id="galera">
    <v-app :theme="darkMode ? 'dark' : 'light'">
      <NavigationMenu />
      <router-view />
    </v-app>
    <MediaModal v-if="isModalActive" />
  </div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";

import MediaModal from "~/components/media-modal.vue";
import { useSelectedMediaStore } from "~/stores/selected-media";
import { useUserPreferencesStore } from "~/stores/user-preferences";

import NavigationMenu from "./components/navigation-menu.vue";

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

const selectedMedia = useSelectedMediaStore();
const { isModalActive } = storeToRefs(selectedMedia);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#logo {
  margin: 0 auto;
}
</style>
