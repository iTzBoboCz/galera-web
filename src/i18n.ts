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
  datetimeFormats: {
    "en-US": {
      time: {},
      date: {},
      datetime: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      },
    },
    cs: {
      time: {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      },
      date: {
        day: "numeric",
        month: "long",
        year: "numeric",
      },
      datetime: {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      },
    },
  },
});

export default i18n;
