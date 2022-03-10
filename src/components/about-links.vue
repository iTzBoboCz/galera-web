<template>
  <v-list>
    <v-list-subheader>{{ t("settings.importantLinks") }}</v-list-subheader>
    <v-list-item
      v-for="item in linkItems"
      :key="item.name"
      :href="item.link"
      :prepend-icon="item.icon"
      append-icon="mdi-open-in-new"
      :title="item.name"
      :disabled="item.disabled"
      target="_blank"
      rel="noreferrer noopener"
      class="text-left"
    >
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "AboutLinks",
};
</script>

<script setup lang="ts">
const { t } = useI18n();

const linkItems = computed(() => {
  return [
    {
      icon: "mdi-rocket-launch",
      name: t("links.projectHomePage"),
      link: "https://github.com/iTzBoboCz/galera-web",
    },
    {
      icon: "mdi-book",
      name: t("links.readTheDocumentation"),
      link: "",
      disabled: true,
    },
    {
      icon: "mdi-translate",
      name: t("links.helpTranslating"),
      link: "",
      disabled: true,
    },
    {
      icon: "mdi-bug",
      name: t("links.reportAnIssueWithWebClient"),
      link: "https://github.com/galera/galera-web/issues/new",
    },
  ];
});
</script>
