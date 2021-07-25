<template>
  <v-app :theme="darkMode ? 'dark' : 'light'">
    <v-img
      id="logo"
      :width="200"
      alt="Vue logo"
      class="my-3"
      contain
      :src="logo"
    />
    <HelloWorld :msg="t('gallery')" />
    <LocaleSwitcher />
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { createNamespacedHelpers } from "vuex-composition-helpers";

import logo from "~/assets/logo.png";
import { useStore } from "~/store/index";

import HelloWorld from "./components/hello-world.vue";
import LocaleSwitcher from "./components/locale-switcher.vue";

export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
    LocaleSwitcher,
  },
  setup() {
    const { t } = useI18n();

    const store = useStore();

    const { useState } = createNamespacedHelpers(store, "userPreferences");

    const { darkMode } = useState(["darkMode"]);

    return { darkMode, t };
  },
  data: () => ({
    logo,
  }),
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
