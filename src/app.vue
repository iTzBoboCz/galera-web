<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld :msg="t('gallery')" />
  <LocaleSwitcher />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

import HelloWorld from "./components/hello-world.vue";
import LocaleSwitcher from "./components/locale-switcher.vue";

export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
    LocaleSwitcher,
  },
  setup() {
    const { locale, t } = useI18n();

    return { locale, t };
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
</style>
