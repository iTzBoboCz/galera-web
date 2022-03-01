<template>
  <!-- TODO: remake this later -->
  <NavigationMenu v-if="auth.isLoggedIn" />
  <v-toolbar v-else>
    <v-spacer />
    <ViewChanger />
  </v-toolbar>
  <v-main>
    <router-view />
  </v-main>
  <MediaModal v-if="isModalActive" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import ViewChanger from "~/components/buttons/view-changer.vue";
import MediaModal from "~/components/media-modal.vue";
import NavigationMenu from "~/components/navigation-menu.vue";
import { useAuthStore } from "~/stores/auth";
import { useSelectedMediaStore } from "~/stores/selected-media";

const auth = useAuthStore();
const selectedMedia = useSelectedMediaStore();
const { isModalActive } = storeToRefs(selectedMedia);
</script>
