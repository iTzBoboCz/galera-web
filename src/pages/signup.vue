<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col sm="10" md="7" lg="5" cols="auto">
        <h1 class="text-h4 mb-6 text-center">{{ $t("pages.signUp") }}</h1>
        <form @submit.prevent="submitSignup">
          <v-text-field
            v-model="username"
            :label="t('account.username')"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="email"
            :label="t('account.email')"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="password"
            :label="t('account.password')"
            type="password"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="passwordAgain"
            :label="t('account.passwordAgain')"
            type="password"
            variant="outlined"
            required
          />
          <v-row align="center" justify="center" no-gutters>
            <v-col>
              <span>
                {{ t("account.alreadyHaveAnAccount") }}
                <v-btn to="/login">{{ t("account.logIn") }}</v-btn>
              </span>
            </v-col>
            <v-col>
              <v-btn color="primary" type="submit" block>{{
                t("account.signUp")
              }}</v-btn>
            </v-col>
          </v-row>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { NewUser } from "@galera/client-axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import router from "~/router";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();

const username = ref("");
const email = ref("");
const password = ref("");
const passwordAgain = ref("");

const { t } = useI18n();

async function submitSignup() {
  if (password.value != passwordAgain.value) {
    return;
  }

  if (username.value.length < 5 || username.value.length > 30) {
    return;
  }

  const newUser: NewUser = {
    username: username.value,
    email: email.value,
    password: password.value,
  };

  await auth.signUp(newUser);

  if (auth.isLoggedIn) {
    const redirectTo =
      router.currentRoute.value.query.redirect?.toString() ?? "/";
    console.log(redirectTo);
    router.push(redirectTo);
  }
}
</script>

<style scoped>
/* TODO: remove when Vuetify implements something similar */
.fill-height {
  height: 100%;
  display: flex;
}
</style>

<route lang="yaml">
meta:
  layout: fullpage
</route>
