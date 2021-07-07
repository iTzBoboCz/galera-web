import { createRouter, createWebHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";

const routes = generatedRoutes;
console.dir(routes);

const routesWithLayouts = setupLayouts(routes);

const router = createRouter({
  history: createWebHistory("/"),
  routes: routesWithLayouts,
});

export default router;
