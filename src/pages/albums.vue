@@ -0,0 +1,71 @@
<template>
  <v-container>
    <v-btn icon="mdi-plus" @click="createAlbum()">
      <v-tooltip activator="parent" :text="t('album.create')" anchor="bottom" />
    </v-btn>
    <!-- TODO: redo this when Vuetify adds more info about grids -->
    <div id="album-grid">
      <v-card
        v-for="album in albums"
        :key="album.link"
        :to="'/album/' + album.link"
      >
        <div class="" style="width: nastavit; height: nastavit">
          <!-- <img :src="album.thumbnail_link" /> -->
        </div>
        <span>{{ album }}</span>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts">
import { AlbumResponse } from "@galera/client-axios";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

import api from "~/composables/api";

export default defineComponent({
  setup() {
    const { t } = useI18n();

    return { t };
  },
  data(): { albums: AlbumResponse[] } {
    return {
      albums: [],
    };
  },
  async created() {
    this.albums = await api()
      .routesGetAlbumList()
      .then((response) => {
        return response.data;
      });

    this.addAlbum();
  },
  methods: {
    addAlbum() {
      const container = document.querySelector("v-flex");

      // TODO: ask user for album name and append new album
      // container?.append;

      console.log(container);
    },
    createAlbum() {
      let d = api().routesCreateAlbum({ albumInsertData: { name: "test" } });
      console.log(d);
    },
  },
});
</script>

<style scoped>
#album-grid {
  display: flex;
  justify-content: start;
}

#album-grid > * {
  display: inline-block;
  float: left;
}
</style>
