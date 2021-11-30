import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";
import { createRouter, createWebHistory } from "vue-router";
import { createNamespacedHelpers } from "vuex-composition-helpers";

import { store } from "~/store/index";

const { useGetters } = createNamespacedHelpers(store, "auth");

const routes = generatedRoutes;
console.dir(routes);

const routesWithLayouts = setupLayouts(routes);

const router = createRouter({
  history: createWebHistory("/"),
  routes: routesWithLayouts,
});

function isAuthRequired(publicPagesList: string[], pageName: string): boolean {
  return !publicPagesList.includes(pageName);
}

const publicPages = ["signup", "login"];

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useGetters(["isLoggedIn"]);

  if (
    to.name &&
    isAuthRequired(publicPages, to.name.toString()) &&
    !isLoggedIn.value
  ) {
    console.error(
      "You need to be authenticated to see this page. Redirecting to login page..."
    );
    if (from.name == "signup") {
      next({
        path: "/signup",
        query: { redirect: to.fullPath },
      });
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    }
  } else if (isLoggedIn.value && (to.name == "login" || to.name == "signup")) {
    // TODO: doesn't work (always redirects to "/")
    const redirectTo =
      router.currentRoute.value.query.redirect?.toString() ?? "/";

    next(redirectTo);
  } else {
    next();
  }
});

export default router;
