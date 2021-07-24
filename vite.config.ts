import VueI18n from "@intlify/vite-plugin-vue-i18n";
import Vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  resolve: {
    alias: {
      // FIX: fix this later
      // eslint-disable-next-line unicorn/prefer-module
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    Vue(),
    VueI18n({
      // FIX: fix this later
      // eslint-disable-next-line unicorn/prefer-module
      include: path.resolve(__dirname, "./src/locales/**"),
    }),
    Pages(),
    Layouts(),
  ],
});
