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
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { createNamespacedHelpers } from "vuex-composition-helpers";

import MediaModal from "~/components/media-modal.vue";
import { useStore } from "~/store/index";

import NavigationMenu from "./components/navigation-menu.vue";

export default defineComponent({
  name: "App",
  components: {
    NavigationMenu,
    MediaModal,
  },
  setup() {
    const { t } = useI18n();

    const store = useStore();

    const { useState } = createNamespacedHelpers(store, "userPreferences");

    const { darkMode } = useState(["darkMode"]);

    const { useGetters } = createNamespacedHelpers(store, "selectedMedia");

    const { isModalActive } = useGetters(["isModalActive"]);

    return { darkMode, t, isModalActive };
  },
});
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
