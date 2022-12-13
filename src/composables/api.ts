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
    encodeURIComponent(unicode_string).replace(
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
    Authorization = `Bearer ${auth.bearerToken?.bearerTokenEncoded}`;
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

  const axiosInstance = axios.create();

  // Tries to refresh user's token when request fails
  // used only for BearerAuth
  if (
    finalConfiguration.baseOptions &&
    finalConfiguration.baseOptions.headers &&
    finalConfiguration.baseOptions.headers.Authorization &&
    finalConfiguration.baseOptions.headers.Authorization.startsWith("Bearer")
  ) {
    const auth = useAuthStore();

    const { isLoggedIn } = storeToRefs(auth);

    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        // refresh token if server responds with Unauthorized
        if (error.response?.status == 401) {
          await auth.refreshToken();

          // if there are no headers, we can't send a request with certainty because the server could only accept some content-type, etc.
          if (isLoggedIn.value && error.config.headers) {
            // retry last request
            const headers = error.config.headers;
            headers.Authorization = `Bearer ${auth.bearerToken?.bearerTokenEncoded}`;

            // eslint-disable-next-line promise/no-promise-in-callback
            const retry = await axios({
              method: error.config.method,
              url: error.config.url,
              data: error.config.data,
              headers,
              responseType: error.config.responseType,
            })
              .then((response) => {
                // must be response, not response.data
                return response;
              })
              .catch(() => {
                return;
              });

            if (retry) {
              return retry;
            }
          }

          await auth.logOut();
          router.go(0);

          throw error;
        }
      }
    );
  }

  return new DefaultApi(
    finalConfiguration,
    finalConfiguration.basePath,
    axiosInstance
  );
}
