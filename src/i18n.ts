import messages from "@intlify/vite-plugin-vue-i18n/messages";
import { createI18n } from "vue-i18n";

import { getLocalUserPreferences } from "~/stores/user-preferences";

// TODO: check getLocalUserPreferences() vs useUserPreferencesStore() performance
const localUserPreferences = getLocalUserPreferences();

const i18n = createI18n({
  locale: localUserPreferences.locale,
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
