<template>
  <div class="locale-switcher">
    <select v-model="$i18n.locale">
      <option
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
        @click="setLocale({ locale })"
      >
        {{ getNativeLanguageName(locale) }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import ISO6391 from "iso-639-1";
import { defineComponent } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers";

import { useStore } from "../store/";

export default defineComponent({
  name: "LocaleSwitcher",
  setup() {
    const store = useStore();

    const { useActions } = createNamespacedHelpers(store, "userPreferences");

    const { setLocale } = useActions(["setLocale"]);

    return { setLocale, store };
  },
  methods: {
    /**
     * Gets native language name from passed language_code.
     * @param {string} language_code Language code (can be of these types: en, en-US)
     * @returns {string} Returns native name of a language with first name capitalized.
     */
    getNativeLanguageName(language_code: string): string {
      // remove country code if present
      let sanitized_language_code = language_code.split("-")[0];

      // get native name of a language
      let name = ISO6391.getNativeName(sanitized_language_code);

      // TODO: return in format: English (US) if country code present
      // capitalize the first letter
      return name.charAt(0).toUpperCase() + name.slice(1, name.length);
    },
  },
});
</script>
