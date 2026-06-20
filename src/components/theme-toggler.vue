<template>
  <v-btn color="primary" @click="userPreferences.toggleDarkMode"
    >switch to {{ userPreferences.darkMode ? "light" : "dark" }} theme</v-btn
  >
</template>

<script setup lang="ts">
import { useUserPreferencesStore } from "~/stores/user-preferences";

defineOptions({
  name: "ThemeToggler",
});

const userPreferences = useUserPreferencesStore();
</script>
