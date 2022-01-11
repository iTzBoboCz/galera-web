<template>
  <v-menu bottom left>
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar color="teal">
          <span v-if="isLoggedIn" class="text-h5">{{
            auth.userInfo?.username[0].toUpperCase()
          }}</span>
        </v-avatar>
      </v-btn>
    </template>
    <v-list>
      <v-list-item :title="t('navigation.settings')" to="/settings" />
      <v-list-item :title="t('navigation.logOut')" @click="logOutClick" />
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

import router from "~/router";
import { useAuthStore } from "~/stores/auth";

export default {
  name: "UserMenu",
};
</script>

<script setup lang="ts">
const { t } = useI18n();

const auth = useAuthStore();

const { isLoggedIn } = storeToRefs(auth);

async function logOutClick() {
  await auth.logOut();

  // refresh page
  router.go(0);
}
</script>
