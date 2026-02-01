<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col sm="10" md="7" lg="5" cols="auto">
        <ErrorDisabledLayout
          v-if="
            auth.serverConfig?.auth.policy.disable_local_auth ||
            auth.serverConfig?.auth.policy.disable_local_signups
          "
        >
          <div class="text-center">
            <h1 class="mt-4">{{ t("error.auth.signupDisabled") }}</h1>
          </div>
        </ErrorDisabledLayout>
        <template v-else>
          <h1 class="text-h4 mb-6 text-center">{{ t("pages.signUp") }}</h1>
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
              :type="isPasswordShown ? 'text' : 'password'"
              :append-inner-icon="isPasswordShown ? 'mdi-eye-off' : 'mdi-eye'"
              variant="outlined"
              required
              @click:append-inner="isPasswordShown = !isPasswordShown"
            />
            <v-text-field
              v-model="passwordAgain"
              :label="t('account.passwordAgain')"
              :type="isPasswordAgainShown ? 'text' : 'password'"
              :append-inner-icon="
                isPasswordAgainShown ? 'mdi-eye-off' : 'mdi-eye'
              "
              variant="outlined"
              required
              @click:append-inner="isPasswordAgainShown = !isPasswordAgainShown"
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
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { NewUser } from "@galera/client-axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

// eslint-disable-next-line import/default
import ErrorDisabledLayout from "~/layouts/error-disabled.vue";
import router from "~/router";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
auth.getServerConfig();

const username = ref("");
const email = ref("");
const password = ref("");
const passwordAgain = ref("");

const isPasswordShown = ref(false);
const isPasswordAgainShown = ref(false);

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
