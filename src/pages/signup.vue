<template>
  <v-container>
    <h1 class="text-h4 mb-6 text-center">{{ $t("pages.signUp") }}</h1>
    <v-row align="center" justify="center">
      <v-col sm="10" md="7" lg="5" cols="auto">
        <form @submit.prevent="submitSignup">
          <v-text-field
            v-model="username"
            :label="t('account.username')"
            required
          />
          <v-text-field v-model="email" :label="t('account.email')" required />
          <v-text-field
            v-model="password"
            :label="t('account.password')"
            type="password"
            required
          />
          <v-text-field
            v-model="passwordAgain"
            :label="t('account.passwordAgain')"
            type="password"
            required
          />
          <v-btn color="primary" type="submit">{{ t("account.signUp") }}</v-btn>
          <p>
            {{ t("account.alreadyHaveAnAccount") }}
            <v-btn to="/login">{{ t("account.logIn") }}</v-btn>
          </p>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { NewUser } from "@galera/client-axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { createNamespacedHelpers } from "vuex-composition-helpers";

import router from "~/router";
import { useStore } from "~/store/index";

const store = useStore();

const { useActions, useGetters } = createNamespacedHelpers(store, "auth");

const { signUp } = useActions(["signUp"]);
const { isLoggedIn } = useGetters(["isLoggedIn"]);

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

  await signUp(newUser);

  if (isLoggedIn.value) {
    const redirectTo =
      router.currentRoute.value.query.redirect?.toString() ?? "/";
    console.log(redirectTo);
    router.push(redirectTo);
  }
}
</script>
