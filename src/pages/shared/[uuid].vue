<template>
  <v-container>
    <div v-if="albumShareLinkBasic">
      <v-alert
        v-if="albumShareLinkBasic.is_expired"
        type="warning"
        variant="tonal"
      >
        {{ t("dialogs.albumShareLink.expired") }}
      </v-alert>
      <div v-else-if="albumShareLinkBasic.is_password_protected && !albumMedia">
        <form @submit.prevent>
          <v-text-field
            v-model="albumShareLinkPassword"
            :label="t('account.password')"
            :type="isPasswordShown ? 'text' : 'password'"
            :append-inner-icon="isPasswordShown ? 'mdi-eye-off' : 'mdi-eye'"
            required
            @click:append-inner="isPasswordShown = !isPasswordShown"
          />
          <v-btn
            @click.prevent="
              if (albumShareLinkBasic)
                getAlbumShareLinkMediaStructure(albumShareLinkBasic.album_uuid);
            "
          >
            {{ t("general.unlock") }}
          </v-btn>
        </form>
      </div>
      <div v-else>
        <ViewWrapper
          v-if="albumMedia && albumMedia.length > 0"
          :media-list="albumMedia"
          :album-share-link-auth="albumShareLinkAuth"
        />
        <v-alert v-else type="info" variant="tonal">
          {{ t("noContent.album") }}
        </v-alert>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { AlbumShareLinkBasic, MediaResponse } from "@galera/client-axios";
import { Ref, ref } from "vue";
import { useI18n } from "vue-i18n";

import ViewWrapper from "~/components/view-wrapper.vue";
import api, {
  AlbumShareLinkScheme,
  defaultConfiguration,
} from "~/composables/api";

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const albumMedia: Ref<MediaResponse[] | undefined> = ref();
const albumShareLinkBasic: Ref<AlbumShareLinkBasic | undefined> = ref();
const albumShareLinkPassword: Ref<string | undefined> = ref();
const albumShareLinkAuth: Ref<AlbumShareLinkScheme | undefined> = ref();

const isPasswordShown = ref(false);

async function getAlbumShareLinkBasicInfo() {
  const response = await api(defaultConfiguration("noAuth"))
    .routesGetAlbumShareLink({ albumShareLinkUuid: props.uuid })
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return;
    });

  if (response) {
    albumShareLinkBasic.value = response;
  }
}

// eslint-disable-next-line promise/catch-or-return, unicorn/prefer-top-level-await
getAlbumShareLinkBasicInfo().then(() => {
  if (
    albumShareLinkBasic.value &&
    !albumShareLinkBasic.value.is_expired &&
    !albumShareLinkBasic.value.is_password_protected
  ) {
    getAlbumShareLinkMediaStructure(albumShareLinkBasic.value.album_uuid);
  }

  return;
});

async function getAlbumShareLinkMediaStructure(albumUuid: string) {
  console.error(albumShareLinkPassword.value);
  const response = await api(
    defaultConfiguration({
      albumShareLinkUuid: props.uuid,
      password: albumShareLinkPassword.value,
    })
  )
    .routesGetAlbumStructure({ albumUuid })
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return;
    });

  if (response) {
    albumShareLinkAuth.value = {
      albumShareLinkUuid: props.uuid,
      password: albumShareLinkPassword.value,
    };

    albumMedia.value = response;
  }
}
</script>
