import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";
import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "~/stores/auth";

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

const publicGeneralPages = ["shared-uuid"];
const publicAuthPages = ["signup", "login", "auth-oidc-callback"];
const publicPages = [...publicAuthPages, ...publicGeneralPages];

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  const isAuthPage = publicAuthPages.includes(to.name?.toString() ?? "");
  const needsAuth =
    !!to.name && isAuthRequired(publicPages, to.name.toString());

  console.error(needsAuth);

  // try sessionBootstrap (silent login)
  if (needsAuth || isAuthPage) {
    await auth.sessionBootstrap();
  }

  // Protected pages: ensure we have a valid access token
  if (needsAuth) {
    const isFresh = await auth.ensureFreshToken();
    if (!isFresh) {
      console.error(
        "You need to be authenticated to see this page. Redirecting to login page..."
      );
      next({ path: "/login", query: { redirect: to.fullPath } });

      return;
    }
  }

  if (auth.isLoggedIn && (to.name == "login" || to.name == "signup")) {
    const redirectTo = to.query.redirect?.toString() ?? "/";
    next(redirectTo);

    return;
  }

  next();
});
export default router;
