<template>
  <p>Settings</p>
  <v-img
    id="logo"
    :width="200"
    alt="Vue logo"
    class="my-3"
    contain
    :src="logo"
  />
  <ThemeToggler />
  <LocaleSwitcher />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import logo from "~/assets/logo.png";
import LocaleSwitcher from "~/components/locale-switcher.vue";
import ThemeToggler from "~/components/theme-toggler.vue";

export default defineComponent({
  name: "App",
  components: {
    LocaleSwitcher,
    ThemeToggler,
  },
  data: () => ({
    logo,
  }),
});
</script>
