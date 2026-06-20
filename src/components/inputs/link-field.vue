<template>
  <v-text-field
    v-model="link"
    :label="t('general.link')"
    readonly
    append-icon="mdi-content-copy"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

defineOptions({
  name: "LinkField",
});

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const link = ref(window.location.host + props.url);
</script>
