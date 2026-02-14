import { Configuration, DefaultApi } from "@galera/client-axios";
import axios, { AxiosError } from "axios";
import { storeToRefs } from "pinia";

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
  let Authorization: string | undefined;
  // TODO: there might be a better way to check if authenticationScheme is AlbumShareLinkScheme
  if (authenticationScheme == "bearer") {
    const auth = useAuthStore();
    if (auth.bearerToken?.bearerTokenEncoded) {
      Authorization = `Bearer ${auth.bearerToken.bearerTokenEncoded}`;
    }
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
    Authorization = `Basic ${b64EncodeUnicode(token)}`;
  }

  return new Configuration({
    basePath: "/api",
    baseOptions: {
      headers: {
        Authorization,
        "Content-type": "application/json",
      },
    },
  });
}

export default function api(config?: Configuration): DefaultApi {
  const finalConfiguration = config ?? defaultConfiguration();

  const axiosInstance = axios.create({
    withCredentials: true,
  });

  if (
    finalConfiguration.baseOptions?.headers?.Authorization &&
    finalConfiguration.baseOptions.headers.Authorization.startsWith("Bearer")
  ) {
    const auth = useAuthStore();
    const { isLoggedIn } = storeToRefs(auth);

    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // cookie-based refresh (no bearer needed)
          await auth.refreshToken();

          if (isLoggedIn.value && error.config?.headers) {
            // retry with new bearer
            const headers = error.config.headers as any;
            headers.Authorization = auth.bearerToken?.bearerTokenEncoded
              ? `Bearer ${auth.bearerToken.bearerTokenEncoded}`
              : undefined;

            // eslint-disable-next-line promise/no-promise-in-callback
            const retry = await axios({
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
          router.go(0);
        }

        throw error;
      }
    );
  }

  return new DefaultApi(
    finalConfiguration,
    finalConfiguration.basePath,
    axiosInstance
  );
}
