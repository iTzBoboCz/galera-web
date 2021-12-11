<template>
  <v-container>
    <h1 class="text-h4 mb-6 text-center">{{ $t("pages.login") }}</h1>
    <v-row align="center" justify="center">
      <v-col sm="10" md="7" lg="5" cols="auto">
        <form @submit.prevent="submitLogin">
          <v-text-field
            v-model="usernameOrEmail"
            :label="t('account.usernameOrEmail')"
            required
          />
          <v-text-field
            v-model="password"
            :label="t('account.password')"
            type="password"
            required
          />
          <v-btn color="primary" type="submit">{{ t("account.logIn") }}</v-btn>
          <p>
            {{ t("account.dontHaveAnAccountYet") }}
            <v-btn to="/signup">{{ t("account.signUp") }}</v-btn>
          </p>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { UserLogin } from "@galera/client-axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import router from "~/router";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();

const usernameOrEmail = ref("");
const password = ref("");

const { t } = useI18n();

async function submitLogin() {
  if (password.value.length < 8 || password.value.length > 128) {
    return;
  }

  // check username with regex

  if (usernameOrEmail.value.length > 5) {
    const userLogin: UserLogin = {
      username_or_email: usernameOrEmail.value,
      password: password.value,
    };

    await auth.logIn(userLogin);

    if (auth.isLoggedIn) {
      const redirectTo =
        router.currentRoute.value.query.redirect?.toString() ?? "/";
      console.log(redirectTo);
      router.push(redirectTo);
    }
  }
}
</script>
