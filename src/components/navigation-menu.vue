<template>
  <v-navigation-drawer
    v-if="!display.mobile.value"
    v-model="drawer"
    :temporary="display.mobile.value"
    :permanent="display.mobile.value"
    app
  >
    <v-list>
      <v-list-item
        v-for="menuItem in menuMainItems"
        :key="menuItem.title"
        :to="menuItem.to"
        router
        exact
      >
        <v-icon>{{ menuItem.icon }}</v-icon>
        <v-list-item-title v-text="menuItem.title" />
      </v-list-item>
      <v-divider />
      <v-list-item
        v-for="menuItem in menuMoreItems"
        :key="menuItem.title"
        :to="menuItem.to"
        router
        exact
      >
        <v-icon>{{ menuItem.icon }}</v-icon>
        <v-list-item-title v-text="menuItem.title" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar flat border="1" app>
    <v-app-bar-nav-icon
      v-if="!display.mobile.value"
      @click="drawer = !drawer"
    />

    <v-app-bar-title>Application</v-app-bar-title>
    <v-spacer />
    <v-avatar color="teal" size="56"></v-avatar>
  </v-app-bar>
  <v-bottom-navigation v-if="display.mobile.value">
    <v-btn
      v-for="menuItem in menuMainItems"
      :key="menuItem.title"
      :to="menuItem.to"
    >
      <v-icon>{{ menuItem.icon }}</v-icon>
      <span>{{ menuItem.title }}</span>
    </v-btn>
    <v-btn v-if="menuMoreItems.length > 0" @click="drawer = !drawer">
      <v-icon>mdi-menu</v-icon>
      <span>{{ t("general.more") }}</span>
      <v-menu activator="parent" anchor="bottom end">
        <v-sheet>
          <v-list>
            <v-list-item
              v-for="menuItem in menuMoreItems"
              :key="menuItem.title"
              :link="menuItem.to"
            >
              <v-icon>{{ menuItem.icon }}</v-icon>
              <span>{{ menuItem.title }}</span>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-menu>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "NavigationMenu",
});
</script>

<script setup lang="ts">
const display = useDisplay();

const { t } = useI18n();

const drawer = ref(false);

interface MenuItem {
  title: string;
  icon: string;
  to: string;
}

const menuMainItems = computed((): MenuItem[] => {
  return [
    {
      title: t("photos"),
      icon: "mdi-image-multiple",
      to: "/",
    },
    {
      title: t("albums"),
      icon: "mdi-folder",
      to: "/albums",
    },
    {
      title: t("sharedAlbums"),
      icon: "mdi-folder-eye",
      to: "/albums/shared",
    },
  ];
});

const menuMoreItems = computed((): MenuItem[] => {
  return [
    {
      title: t("favorite"),
      icon: "mdi-heart",
      to: "/favorite",
    },
  ];
});
</script>
