import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";

import App from "~/app.vue";
import i18n from "~/i18n";
import Vuetify from "~/plugins/vuetify";
import router from "~/router";

const app = createApp(App);
// TODO: add inheritLocale: true to components
// TODO: find out what scope is better - global or local??

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(Vuetify);
app.use(i18n);
app.use(router);
app.use(pinia);

app.mount("#app");
