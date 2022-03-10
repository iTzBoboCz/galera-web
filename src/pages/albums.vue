@@ -0,0 +1,71 @@
<template>
  <v-container>
    <v-btn icon="mdi-plus" @click="createAlbumDialog = true">
      <v-tooltip activator="parent" :text="t('album.create')" anchor="bottom" />
    </v-btn>
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
            v-bind="hoverProps.props"
            :to="'/album/' + album.link"
            min-height="10vh"
            min-width="10vh"
          >
            <v-card-text>{{ album.name }}</v-card-text>
            <!-- <img :src="album.thumbnail_link" /> -->
            <!-- TODO: width and height might not be needed in the future too -->
            <!-- TODO: hide menu by default, show on hover -->
            <v-menu bottom left>
              <template #activator="menuActivator">
                <v-btn
                  v-bind="menuActivator.props"
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
                <!-- TODO: add confirmational dialog (Are you sure you want to delete this album?) -->
                <v-list-item
                  :title="t('album.delete')"
                  @click="fetchedMedia.deleteAlbum(album)"
                />
                <v-list-item
                  :title="t('album.share')"
                  @click="openAlbumShareLinkDialog(album)"
                />
              </v-list>
            </v-menu>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-alert v-else type="info" variant="contained-text">
      {{ t("noContent.albums") }}
    </v-alert>
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
  <!-- TODO: add scrollable prop when it is implemented -->
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

const albumName = ref("");
const currentAlbumIndex: Ref<number | undefined> = ref();
const currentAlbumUuid: Ref<string | undefined> = ref();

async function openAlbumShareLinkDialog(album: AlbumResponse) {
  currentAlbumIndex.value = fetchedMedia.albumList?.findIndex(
    (a) => a.link == album.link
  );

  if (
    fetchedMedia.albumList &&
    typeof currentAlbumIndex.value !== "undefined"
  ) {
    shareAlbumDialog.value = true;
    currentAlbumUuid.value = album.link;

    await fetchedMedia.getAlbumShareLinks(album.link);
  }
}

function createAlbumShareLink() {
  if (currentAlbumUuid.value) {
    fetchedMedia.createAlbumShareLink(currentAlbumUuid.value);
  }
}
</script>
