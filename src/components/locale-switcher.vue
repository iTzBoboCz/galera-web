<template>
  <select v-model="$i18n.locale">
    <option
      v-for="locale in $i18n.availableLocales"
      :key="`locale-${locale}`"
      :value="locale"
      @click="userPreferences.setLocale($i18n, locale)"
    >
      {{ getNativeLanguageName(locale) }}
    </option>
  </select>
</template>

<script lang="ts">
import ISO6391 from "iso-639-1";
import { defineComponent } from "vue";

import { useUserPreferencesStore } from "~/stores/user-preferences";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "LocaleSwitcher",
});
</script>

<script setup lang="ts">
const userPreferences = useUserPreferencesStore();

/**
 * Gets native language name from passed language_code.
 * @param {string} language_code Language code (can be of these types: en, en-US)
 * @returns {string} Returns native name of a language with first name capitalized.
 */
function getNativeLanguageName(language_code: string): string {
  // remove country code if present
  let sanitized_language_code = language_code.split("-")[0];

  // get native name of a language
  let name = ISO6391.getNativeName(sanitized_language_code);

  // TODO: return in format: English (US) if country code present
  // capitalize the first letter
  return name.charAt(0).toUpperCase() + name.slice(1, name.length);
}
</script>
