<template>
  <v-container>
    <v-row class="pt-4" justify="center">
      <v-col cols="12" lg="5" md="4">
        <v-card>
          <v-card-subtitle>test </v-card-subtitle>
          <select v-model="selectedFolder" disabled>
            <option :value="undefined">
              {{ t("settings.library.allFolders") }}
            </option>
            <option
              v-for="folder in folders"
              :key="folder.uuid"
              :value="folder.uuid"
            >
              {{ folder.name }}
            </option>
          </select>

          <v-btn color="primary" block @click="fetchedMedia.scanMedia">
            {{ t("settings.library.scan") }}
          </v-btn>
          <v-checkbox
            v-model="rescan"
            :label="t('settings.library.completeRescan')"
            disabled
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { useFetchedMediaStore } from "~/stores/fetched-media";

const fetchedMedia = useFetchedMediaStore();

const { t } = useI18n();

// TODO: fetch this from the API
const folders = [
  { name: "/test", uuid: "someUuid1" },
  { name: "/test/photos", uuid: "someUuid2" },
  { name: "/test2", uuid: "someUuid3" },
  { name: "/test3", uuid: "someUuid4" },
];

const selectedFolder = ref();

const rescan = ref(false);
</script>
