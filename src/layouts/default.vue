<template>
  <NavigationMenu />
  <v-main>
    <router-view />
  </v-main>
  <MediaModal v-if="isModalActive" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import MediaModal from "~/components/media-modal.vue";
import NavigationMenu from "~/components/navigation-menu.vue";
import { useSelectedMediaStore } from "~/stores/selected-media";

const selectedMedia = useSelectedMediaStore();
const { isModalActive } = storeToRefs(selectedMedia);
</script>
