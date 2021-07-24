<script lang="ts">
import { RouteRecordNormalized } from "vue-router";

import router from "~/router";

export default {
  data(): { routes: RouteRecordNormalized[] } {
    return {
      routes: router.getRoutes(),
    };
  },
};
</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <div class="w-1/4 m-auto text-center text-gray-300 bg-teal-800">
      Default Layout
    </div>
    <router-view />
    <div class="links">
      <p>Other pages:</p>
      <div v-for="route in routes" :key="route.path">
        <div v-if="route.children.length > 0">
          <router-link :to="route.path">{{ route.path }}</router-link>
        </div>
      </div>
    </div>
  </main>
</template>
