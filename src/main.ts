import { createApp } from "vue";

import App from "./app.vue";
// eslint-disable-next-line unicorn/prevent-abbreviations
import i18n from "./i18n";
import Vuetify from "./plugins/vuetify";
import router from "./router";
import { key, store } from "./store/index";

const app = createApp(App);
// TODO: add inheritLocale: true to components
// TODO: find out what scope is better - global or local??

app.use(Vuetify);
app.use(i18n);
app.use(router);
app.use(store, key);

app.mount("#app");
