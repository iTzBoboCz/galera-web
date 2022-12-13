<template>
  <v-expansion-panel>
    <v-expansion-panel-title>{{
      props.albumShareLink.uuid
    }}</v-expansion-panel-title>
    <v-expansion-panel-text>
      <!-- TODO: replace with v-date-picker when it's implemented -->
      <LinkField :url="'/shared/' + props.albumShareLink.uuid" />
      <v-row>
        <v-col>
          <v-text-field
            v-model="expiration"
            :label="t('general.expiration')"
            type="date"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="newPassword"
            :label="t('account.newPassword')"
            :type="isPasswordShown ? 'text' : 'password'"
            :append-inner-icon="isPasswordShown ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="isPasswordShown = !isPasswordShown"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            color="red"
            variant="text"
            @click="
              fetchedMedia.deleteAlbumShareLink(
                props.albumUuid,
                props.albumShareLink.uuid
              )
            "
            >{{ t("general.delete") }}</v-btn
          >
        </v-col>
        <v-col>
          <v-btn color="primary" variant="text" @click="updateAlbumShareLink()">
            {{ t("general.save") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts">
import { SharedAlbumLinkResponse } from "@galera/client-axios";
import { defineComponent, PropType, Ref, ref } from "vue";
import { useI18n } from "vue-i18n";

import LinkField from "~/components/inputs/link-field.vue";
import rfc3339 from "~/rfc3339";
import { useFetchedMediaStore } from "~/stores/fetched-media";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "AlbumShareLinkExpansionPanel",
});
</script>

<script setup lang="ts">
const props = defineProps({
  albumUuid: {
    type: String,
    required: true,
  },
  albumShareLink: {
    type: Object as PropType<SharedAlbumLinkResponse>,
    required: true,
  },
});

const { t } = useI18n();

const fetchedMedia = useFetchedMediaStore();

const newPassword: Ref<string | undefined> = ref();
const expiration: Ref<string | undefined> = ref(
  props.albumShareLink.expiration
    ? new Date(props.albumShareLink.expiration).toISOString().split("T")[0]
    : undefined
);

const isPasswordShown = ref(false);

function updateAlbumShareLink() {
  if (newPassword.value?.length === 0) {
    newPassword.value = undefined;
  }

  if (expiration.value?.length === 0) {
    expiration.value = undefined;
  }

  fetchedMedia.updateAlbumShareLink(
    props.albumUuid,
    props.albumShareLink.uuid,
    {
      expiration: expiration.value
        ? rfc3339(new Date(expiration.value))
        : undefined,
      password: newPassword.value,
    }
  );
}
</script>
