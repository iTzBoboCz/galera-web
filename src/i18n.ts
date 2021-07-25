/* eslint-disable unicorn/prevent-abbreviations */
import messages from "@intlify/vite-plugin-vue-i18n/messages";
import { createI18n } from "vue-i18n";

import { getLocalUserPreferences } from "~/store/modules/user-preferences";

const localUserPreferences = getLocalUserPreferences();

const i18n = createI18n({
  // TODO: do this without globalInjection
  locale: localUserPreferences.locale,
  globalInjection: true,
  legacy: false,
  fallbackLocale: "en-US",
  messages,
});

export default i18n;
