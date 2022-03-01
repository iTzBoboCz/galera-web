<template>
  <v-text-field
    v-model="link"
    :label="t('general.link')"
    readonly
    append-icon="mdi-content-copy"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "LinkField",
});
</script>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const link = ref(window.location.host + props.url);
</script>
