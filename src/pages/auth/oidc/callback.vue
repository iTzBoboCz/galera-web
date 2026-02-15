<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

function safeRedirectTarget(raw: unknown): string {
  const s = typeof raw === "string" ? raw : "/";
  return s.startsWith("/") ? s : "/";
}

onMounted(async () => {
  const redirectTo = safeRedirectTarget(route.query.redirect);

  if (auth.isLoggedIn) {
    await router.replace(redirectTo);
    return;
  }

  const ok = await auth.sessionBootstrap();

  await (ok
    ? router.replace(redirectTo)
    : router.replace({ path: "/login", query: { redirect: redirectTo } }));
});
</script>
