<template>
  <h1 class="text-h4 text-center">
    {{ t("general.pageNotFound") }}
  </h1>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<route lang="yaml">
meta:
  layout: error
</route>
