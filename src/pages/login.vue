<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col sm="10" md="7" lg="5" cols="auto">
        <h1 class="text-h4 mb-6 text-center">{{ t("pages.login") }}</h1>
        <form @submit.prevent="submitLogin">
          <v-text-field
            v-model="usernameOrEmail"
            :label="t('account.usernameOrEmail')"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="password"
            :label="t('account.password')"
            :type="isPasswordShown ? 'text' : 'password'"
            :append-inner-icon="isPasswordShown ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            required
            @click:append-inner="isPasswordShown = !isPasswordShown"
          />
          <v-row align="center" justify="center" no-gutters>
            <v-col>
              <span>
                {{ t("account.dontHaveAnAccountYet") }}
                <v-btn to="/signup">{{ t("account.signUp") }}</v-btn>
              </span>
            </v-col>
            <v-col>
              <v-btn color="primary" type="submit" block>{{
                t("account.logIn")
              }}</v-btn>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" no-gutters>
            <v-btn
              v-for="provider in auth.serverConfig?.auth.oidc"
              :key="provider.key"
              :href="'/api' + provider.login_url"
              block
              class="mt-3"
              >{{ t("account.logInWith") + " " + provider.display_name }}</v-btn
            >
          </v-row>
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
auth.getServerConfig(); // loads OIDC providers

const usernameOrEmail = ref("");
const password = ref("");

const isPasswordShown = ref(false);

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
