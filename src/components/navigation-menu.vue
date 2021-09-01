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
        <v-list-item-action>
          <v-icon>{{ menuItem.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="t(menuItem.title)" />
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list-item
        v-for="menuItem in menuMoreItems"
        :key="menuItem.title"
        :to="menuItem.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon>{{ menuItem.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="t(menuItem.title)" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar flat border="1" app>
    <v-app-bar-nav-icon
      v-if="!display.mobile.value"
      @click="drawer = !drawer"
    />

    <v-toolbar-title>Application</v-toolbar-title>
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
      <span>{{ t(menuItem.title) }}</span>
    </v-btn>
    <v-btn v-if="menuMoreItems.length > 0" @click="drawer = !drawer">
      <v-icon>mdi-menu</v-icon>
      <span>{{ t("more") }}</span>
      <v-menu activator="parent" anchor="bottom end">
        <v-sheet>
          <v-list>
            <v-list-item
              v-for="menuItem in menuMoreItems"
              :key="menuItem.title"
              :link="menuItem.to"
            >
              <v-icon>{{ menuItem.icon }}</v-icon>
              <span>{{ t(menuItem.title) }}</span>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-menu>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify/composables";

interface MenuItem {
  title: string;
  icon: string;
  to: string;
}

export default defineComponent({
  name: "NavigationMenu",
  setup() {
    const display = useDisplay();

    const { t } = useI18n();

    return { display, t };
  },
  data(): {
    drawer: boolean;
    menuMainItems: MenuItem[];
    menuMoreItems: MenuItem[];
  } {
    return {
      drawer: false,
      menuMainItems: [
        {
          title: "photos",
          icon: "mdi-image-multiple",
          to: "/",
        },
        {
          title: "albums",
          icon: "mdi-folder",
          to: "/albums",
        },
        {
          title: "sharedAlbums",
          icon: "mdi-folder-eye",
          to: "/albums/shared",
        },
      ],
      menuMoreItems: [
        {
          title: "places",
          icon: "mdi-map-marker",
          to: "/places",
        },
      ],
    };
  },
});
</script>
