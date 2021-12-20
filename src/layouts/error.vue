<template>
  <v-main>
    <v-container>
      <v-row align="center" justify="center">
        <v-col sm="10" md="7" lg="5" cols="auto" class="mt-16">
          <v-row justify="center">
            <v-icon icon="mdi-alert" color="warning" size="72" />
          </v-row>
          <v-row justify="center" class="my-10">
            <router-view />
          </v-row>
          <v-row justify="center">
            <v-btn color="primary" @click="router.back()">{{
              t("general.goBack")
            }}</v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const { t } = useI18n();
</script>
