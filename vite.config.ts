import path from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
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
  plugins: [Vue(), Pages(), Layouts()],
});
