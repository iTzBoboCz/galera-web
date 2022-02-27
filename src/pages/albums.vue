@@ -0,0 +1,71 @@
<template>
  <v-container>
    <v-btn icon="mdi-plus" @click="createAlbumDialog = true">
      <v-tooltip activator="parent" :text="t('album.create')" anchor="bottom" />
    </v-btn>
    <v-row>
      <v-col
        v-for="album in fetchedMedia.albumList"
        :key="album.link"
        cols="4"
        lg="1"
        md="2"
        sm="3"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :to="'/album/' + album.link"
            min-height="10vh"
            min-width="10vh"
          >
            <v-card-text>{{ album.name }}</v-card-text>
            <!-- <img :src="album.thumbnail_link" /> -->
            <!-- TODO: remove scroll-strategy prop in the future, because it might default to reposition -->
            <!-- TODO: width and height might not be needed in the future too -->
            <v-overlay
              :model-value="isHovering"
              contained
              width="100%"
              height="100%"
              scroll-strategy="reposition"
              scrim="black"
              class="align-center justify-center"
            >
              <!-- TODO: fix activator -->
              <v-menu bottom left>
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-dots-vertical"
                    color="white"
                    position="absolute"
                    top="1vh"
                    right="1vh"
                    variant="text"
                    @click.prevent=""
                  />
                </template>
                <v-list>
                  <v-list-item
                    :title="t('album.delete')"
                    @click="fetchedMedia.deleteAlbum(album)"
                  />
                </v-list>
              </v-menu>
            </v-overlay>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="createAlbumDialog">
    <v-card :title="t('dialogs.createAlbum.title')">
      <v-card-text>
        <v-text-field
          v-model="albumName"
          :label="t('dialogs.createAlbum.albumName')"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="createAlbumDialog = false"
          >{{ t("general.cancel") }}</v-btn
        >
        <v-btn
          color="primary"
          variant="text"
          :disabled="albumName == ''"
          @click="
            createAlbumDialog = false;
            fetchedMedia.createAlbum(albumName);
          "
          >{{ t("general.create") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { useFetchedMediaStore } from "~/stores/fetched-media";

const { t } = useI18n();

const fetchedMedia = useFetchedMediaStore();

fetchedMedia.getAlbumList();

const createAlbumDialog = ref(false);
const albumName = ref("");
</script>
