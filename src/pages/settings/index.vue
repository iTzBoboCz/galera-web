<template>
  <v-container>
    <v-row class="pt-4" justify="center">
      <v-col cols="12" lg="5" md="4">
        <v-card class="mb-4 pb-3">
          <v-img
            id="logo"
            :height="100"
            alt="Vue logo"
            class="my-3"
            contain
            :src="logo"
          />
          <v-card-subtitle>{{ t("settings.serverInfo") }}</v-card-subtitle>
          <v-table>
            <tbody>
              <tr v-for="row in tableData" :key="row.key">
                <td class="text-left">{{ row.title }}</td>
                <td class="text-left">{{ row.value }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
        <v-card>
          <AboutLinks />
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" md="5">
        <v-card class="mb-4 py-3">
          <v-card-subtitle>{{
            t("settings.localPreferences")
          }}</v-card-subtitle>
          <v-row>
            <v-col align-self="center">
              <ThemeToggler />
            </v-col>
            <v-col>
              <LocaleSwitcher />
            </v-col>
          </v-row>
        </v-card>
        <v-card class="mb-4 py-3">
          <v-card-subtitle>{{ t("settings.userSettings") }}</v-card-subtitle>
          <v-list>
            <v-list-item
              v-for="item in userSettings"
              :key="item"
              :to="item.to"
              :prepend-icon="item.icon"
              :title="item.name"
              :subtitle="item.description"
            />
          </v-list>
        </v-card>
        <v-card v-if="isAdmin" class="mb-4 py-3">
          <v-card-subtitle>{{ t("settings.serverSettings") }}</v-card-subtitle>
          <v-list>
            <v-list-item
              v-for="item in serverSettings"
              :key="item"
              :to="item.to"
              :prepend-icon="item.icon"
              :title="item.name"
              :subtitle="item.description"
              disabled
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { version } from "~/../package.json";
import logo from "~/assets/logo.png";
import AboutLinks from "~/components/about-links.vue";
import LocaleSwitcher from "~/components/locale-switcher.vue";
import ThemeToggler from "~/components/theme-toggler.vue";
import { useFetchedMediaStore } from "~/stores/fetched-media";

const { t } = useI18n();

const fetchedMedia = useFetchedMediaStore();

fetchedMedia.getSystemInfoPublic();

interface ServerInfoTable {
  key: string;
  title: string;
  value: string;
}

const tableData = computed((): ServerInfoTable[] => {
  return [
    {
      key: "serverName",
      title: t("server.serverName"),
      value: fetchedMedia.systemInfoPublic?.serverName ?? "",
    },
    {
      key: "serverVersion",
      title: t("server.serverVersion"),
      value: fetchedMedia.systemInfoPublic?.serverVersion ?? "",
    },
    {
      key: "operatingSystem",
      title: t("server.operatingSystem"),
      value: fetchedMedia.systemInfoPublic?.operatingSystem ?? "",
    },
    {
      key: "systemArchitecture",
      title: t("server.systemArchitecture"),
      value: fetchedMedia.systemInfoPublic?.systemArchitecture ?? "",
    },
    {
      key: "clientVersion",
      title: t("server.clientVersion"),
      value: version,
    },
  ];
});

const userSettings = computed(() => {
  return [
    {
      icon: "mdi-account",
      name: t("settings.account.name"),
      description: t("settings.account.description"),
      to: "/settings/account",
    },
    {
      icon: "mdi-home",
      name: t("settings.homePage.name"),
      description: t("settings.homePage.description"),
      to: "/settings/home",
    },
    {
      icon: "mdi-library-shelves",
      name: t("settings.library.name"),
      description: t("settings.library.description"),
      to: "/settings/library",
    },
  ];
});

const serverSettings = computed(() => {
  return [
    {
      icon: "mdi-users",
      name: t("settings.users.name"),
      description: t("settings.users.description"),
      to: "/settings/server",
    },
  ];
});

const isAdmin = false;
</script>
