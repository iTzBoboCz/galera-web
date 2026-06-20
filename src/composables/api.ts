import { Configuration, DefaultApi, type Middleware } from "@galera/api-client";

import router from "~/router";
import { useAuthStore } from "~/stores/auth";

export interface AlbumShareLinkScheme {
  albumShareLinkUuid: string;
  password?: string;
}

function b64EncodeUnicode(unicode_string: string) {
  return btoa(
    encodeURIComponent(unicode_string).replaceAll(
      /%([\dA-F]{2})/g,
      (_match, p1) => {
        return String.fromCodePoint(Number("0x" + p1));
      }
    )
  );
}

export function defaultConfiguration(
  authenticationScheme: "bearer" | AlbumShareLinkScheme | "noAuth" = "bearer"
): Configuration {
  const headers: Record<string, string> = {
    "Content-type": "application/json",
  };

  // TODO: there might be a better way to check if authenticationScheme is AlbumShareLinkScheme
  if (authenticationScheme === "bearer") {
    const auth = useAuthStore();
    headers.Authorization = auth.bearerToken?.bearerTokenEncoded
      ? `Bearer ${auth.bearerToken.bearerTokenEncoded}`
      : "Bearer";
  } else if (
    typeof authenticationScheme === "object" &&
    authenticationScheme.albumShareLinkUuid
  ) {
    const token =
      authenticationScheme.albumShareLinkUuid +
      ":" +
      (authenticationScheme.password ?? "");

    // btoa() doesn't support unicode in most browsers
    // https://developer.mozilla.org/en-US/docs/Web/API/btoa#unicode_strings
    headers.Authorization = `Basic ${b64EncodeUnicode(token)}`;
  }

  const authMiddleware: Middleware = {
    // request
    pre: async (context) => {
      context.init.credentials = "include";

      const currentHeaders = { ...context.init.headers } as Record<
        string,
        string
      >;
      const authHeader = (
        currentHeaders.Authorization?.toString() ?? ""
      ).trim();
      if (!authHeader.startsWith("Bearer")) return context;
      const auth = useAuthStore();
      const isFresh = await auth.ensureFreshToken();

      currentHeaders.Authorization =
        isFresh && auth.bearerToken?.bearerTokenEncoded
          ? `Bearer ${auth.bearerToken.bearerTokenEncoded}`
          : "Bearer"; // empty Bearer if no bearerTokenEncoded

      context.init.headers = currentHeaders;
      return context;
    },

    // response
    post: async (context) => {
      context.init.credentials = "include"; // keep cookies on retry too
      const currentHeaders = { ...context.init.headers } as Record<
        string,
        string
      >;
      const authHeader = (
        currentHeaders.Authorization?.toString() ?? ""
      ).trim();

      if (context.response.ok) {
        return context.response;
      }

      if (!authHeader.startsWith("Bearer")) throw context.response;

      if (context.response.status === 401) {
        const auth = useAuthStore();
        // cookie-based refresh (no bearer needed)
        const refreshSuccesful = await auth.refreshTokenOnce();

        if (refreshSuccesful) {
          currentHeaders.Authorization = auth.bearerToken?.bearerTokenEncoded
            ? `Bearer ${auth.bearerToken.bearerTokenEncoded}`
            : "Bearer";

          try {
            const retryResponse = await fetch(context.url, context.init);

            if (retryResponse.ok) return retryResponse;
            throw retryResponse;
          } catch (e) {
            // logout
          }
        }

        await auth.logOut();
        const current = router.currentRoute.value.fullPath;
        router.replace({ path: "/login", query: { redirect: current } });
      }

      throw context.response;
    },
  };

  return new Configuration({
    basePath: "/api",
    headers,
    middleware: [authMiddleware],
  });
}

export default function api(config?: Configuration): DefaultApi {
  const finalConfiguration = config ?? defaultConfiguration();

  return new DefaultApi(finalConfiguration);
}
