import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./app.vue";
import router from "./router";
import messages from "@intlify/vite-plugin-vue-i18n/messages";

const app = createApp(App);
// eslint-disable-next-line unicorn/prevent-abbreviations
const i18n = createI18n({
  // TODO: do this without globalInjection
  globalInjection: true,
  legacy: false,
  fallbackLocale: "en-US",
  messages,
});
// TODO: add inheritLocale: true to components
// TODO: find out what scope is better - global or local??

app.use(i18n);
app.use(router);

app.mount("#app");
