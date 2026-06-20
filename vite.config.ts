import path from "node:path";
import process from "node:process";
import VueI18n from "@intlify/unplugin-vue-i18n/vite";
import Vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts-next";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/": {
        target: process.env.BACKEND_URL ?? "http://127.0.0.1:8000/",
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      // FIX: fix this later
      // eslint-disable-next-line unicorn/prefer-module
      "~/": `${path.resolve(import.meta.dirname, "src")}/`,
    },
  },
  plugins: [
    Vue(),
    VueI18n({
      // FIX: fix this later
      // eslint-disable-next-line unicorn/prefer-module
      include: path.resolve(import.meta.dirname, "./src/locales/**"),
    }),
    Pages(),
    Layouts(),
  ],
});
