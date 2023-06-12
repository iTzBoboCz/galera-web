@@ -0,0 +1,71 @@
<template>
  <v-container>
    <!-- https://github.com/vuetifyjs/vuetify/issues/16587 -->
    <v-tooltip :text="t('album.create')" location="end">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon="mdi-plus"
          @click="openCreateAlbumDialog()"
        />
      </template>
    </v-tooltip>
    <v-row v-if="fetchedMedia.albumList && fetchedMedia.albumList.length > 0">
      <v-col
        v-for="album in fetchedMedia.albumList"
        :key="album.link"
        cols="4"
        lg="1"
        md="2"
        sm="3"
      >
        <v-hover v-slot="hoverProps">
          <v-card
            :to="'/album/' + album.link"
            min-height="10vh"
            min-width="10vh"
          >
            <!-- TODO: remove position when Vuetify fixes this -->
            <v-layout full-height>
              <v-app-bar
                density="comfortable"
                theme="dark"
                style="position: relative !important"
              >
                <v-app-bar-title class="text-h6">{{
                  album.name
                }}</v-app-bar-title>
                <template v-slot:append>
                  <v-menu bottom left v-bind="hoverProps.props">
                    <template #activator="menuActivator">
                      <v-btn
                        v-bind="menuActivator.props"
                        icon="mdi-dots-vertical"
                        color="white"
                        position="relative"
                        variant="text"
                        @click.prevent=""
                      />
                    </template>
                    <v-list>
                      <v-list-item
                        :title="t('album.delete')"
                        @click="openAlbumDeleteDialog(album)"
                      />
                      <v-list-item
                        :title="t('album.share')"
                        @click="openAlbumShareLinkDialog(album)"
                      />
                    </v-list>
                  </v-menu>
                </template>
              </v-app-bar>
            </v-layout>
            <!-- <img :src="album.thumbnail_link" /> -->
            <!-- TODO: width and height might not be needed in the future too -->
            <!-- TODO: hide menu by default, show on hover -->
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-alert v-else type="info" variant="tonal">
      {{ t("noContent.albums") }}
    </v-alert>
  </v-container>
  <!-- FIXME: too wide, should be fixed by Vuetify -->
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
  <!-- TODO: add scrollable prop when it is implemented -->
  <!-- FIXME: too wide, should be fixed by Vuetify -->
  <v-dialog v-model="shareAlbumDialog">
    <v-card :title="t('dialogs.shareAlbum.title')">
      <v-card-text>
        <v-expansion-panels
          v-if="
            currentAlbumUuid &&
            fetchedMedia.albumList &&
            typeof currentAlbumIndex !== 'undefined'
          "
        >
          <AlbumShareLinkExpansionPanel
            v-for="albumShareLink in fetchedMedia.albumList[currentAlbumIndex]
              .shareLinks"
            :key="albumShareLink.uuid"
            :album-uuid="currentAlbumUuid"
            :album-share-link="albumShareLink"
          />
        </v-expansion-panels>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="createAlbumShareLink()">{{
          t("general.createNew")
        }}</v-btn>
        <v-btn
          color="primary"
          variant="text"
          @click="shareAlbumDialog = false"
          >{{ t("general.close") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- FIXME: too wide, should be fixed by Vuetify -->
  <v-dialog v-model="deleteAlbumDialog">
    <v-card :title="t('dialogs.deleteAlbum.title')">
      <v-card-text>{{ t("dialogs.deleteAlbum.irreversible") }} </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="deleteAlbumDialog = false"
          >{{ t("general.cancel") }}</v-btn
        >
        <v-btn
          color="red"
          variant="text"
          :disabled="typeof currentAlbumUuid === 'undefined'"
          @click="
            deleteAlbumDialog = false;
            if (currentAlbumUuid) {
              fetchedMedia.deleteAlbum(currentAlbumUuid);
            }
          "
          >{{ t("general.delete") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { AlbumResponse } from "@galera/client-axios";
import { Ref, ref } from "vue";
import { useI18n } from "vue-i18n";

import AlbumShareLinkExpansionPanel from "~/components/album-share-link-expansion-panel.vue";
import { useFetchedMediaStore } from "~/stores/fetched-media";

const { t } = useI18n();

const fetchedMedia = useFetchedMediaStore();

fetchedMedia.getAlbumList();

const createAlbumDialog = ref(false);
const shareAlbumDialog = ref(false);
const deleteAlbumDialog = ref(false);

const albumName = ref("");
const currentAlbumIndex: Ref<number | undefined> = ref();
const currentAlbumUuid: Ref<string | undefined> = ref();

function openCreateAlbumDialog() {
  albumName.value = "";
  createAlbumDialog.value = true;
}

async function openAlbumShareLinkDialog(album: AlbumResponse) {
  currentAlbumIndex.value = fetchedMedia.albumList?.findIndex(
    (a) => a.link == album.link
  );

  if (fetchedMedia.albumList && currentAlbumIndex.value !== undefined) {
    shareAlbumDialog.value = true;
    currentAlbumUuid.value = album.link;

    await fetchedMedia.getAlbumShareLinks(album.link);
  }
}

async function openAlbumDeleteDialog(album: AlbumResponse) {
  currentAlbumIndex.value = fetchedMedia.albumList?.findIndex(
    (a) => a.link == album.link
  );

  if (fetchedMedia.albumList && currentAlbumIndex.value !== undefined) {
    deleteAlbumDialog.value = true;
    currentAlbumUuid.value = album.link;
  }
}

function createAlbumShareLink() {
  if (currentAlbumUuid.value) {
    fetchedMedia.createAlbumShareLink(currentAlbumUuid.value);
  }
}
</script>
