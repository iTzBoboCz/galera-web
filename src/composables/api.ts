import { Configuration, DefaultApi } from "@galera/client-axios";
import axios, { AxiosError } from "axios";

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
      (match, p1) => {
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
  if (authenticationScheme == "bearer") {
    const auth = useAuthStore();
    headers.Authorization = auth.bearerToken?.bearerTokenEncoded
      ? `Bearer ${auth.bearerToken.bearerTokenEncoded}`
      : "Bearer";
  } else if (
    typeof authenticationScheme == "object" &&
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

  return new Configuration({
    basePath: "/api",
    baseOptions: { headers },
  });
}

export default function api(config?: Configuration): DefaultApi {
  const finalConfiguration = config ?? defaultConfiguration();

  const axiosInstance = axios.create({
    withCredentials: true,
  });

  const auth = useAuthStore();

  axiosInstance.interceptors.request.use(async (config) => {
    const headers = (config.headers ?? {}) as any;
    const authHeader = (headers.Authorization?.toString() ?? "").trim();
    if (!authHeader.startsWith("Bearer")) return config;

    const isFresh = await auth.ensureFreshToken();

    headers.Authorization =
      isFresh && auth.bearerToken?.bearerTokenEncoded
        ? `Bearer ${auth.bearerToken.bearerTokenEncoded}`
        : "Bearer"; // empty Bearer if no bearerTokenEncoded

    config.headers = headers;
    config.withCredentials = true;
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const headers = (error.config?.headers ?? {}) as any;
      const authHeader = (headers.Authorization?.toString() ?? "").trim();
      if (!authHeader.startsWith("Bearer")) throw error;

      if (error.response?.status === 401) {
        // cookie-based refresh (no bearer needed)
        const refreshSuccesful = await auth.refreshToken();

        if (refreshSuccesful && error.config?.headers) {
          // retry with new bearer
          const headers = error.config.headers as any;
          headers.Authorization = auth.bearerToken?.bearerTokenEncoded
            ? `Bearer ${auth.bearerToken.bearerTokenEncoded}`
            : "Bearer";

          // eslint-disable-next-line promise/no-promise-in-callback
          const retry = await axiosInstance({
            method: error.config.method,
            url: error.config.url,
            data: error.config.data,
            headers,
            responseType: error.config.responseType,
            withCredentials: true, // keep cookies on retry too
          })
            .then((r) => r)
            .catch(() => {
              return;
            });

          if (retry) return retry;
        }

        await auth.logOut();
        const current = router.currentRoute.value.fullPath;
        router.replace({ path: "/login", query: { redirect: current } });
      }

      throw error;
    }
  );

  return new DefaultApi(
    finalConfiguration,
    finalConfiguration.basePath,
    axiosInstance
  );
}
