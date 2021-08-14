<template>
  <v-container>
    <v-btn color="primary" @click="toggleDarkMode"
      >switch to {{ darkMode ? "light" : "dark" }} theme</v-btn
    >
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers";

import { useStore } from "../store/";

export default defineComponent({
  name: "ThemeToggler",
  setup() {
    const store = useStore();

    const { useActions, useState } = createNamespacedHelpers(
      store,
      "userPreferences"
    );

    const { darkMode } = useState(["darkMode"]);

    const { toggleDarkMode } = useActions(["toggleDarkMode"]);

    return { darkMode, toggleDarkMode };
  },
});
</script>
