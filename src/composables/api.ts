import { Configuration, DefaultApi } from "@galera/client-axios";
import axios, { AxiosError } from "axios";
import { storeToRefs } from "pinia";

import router from "~/router";
import { useAuthStore } from "~/stores/auth";

export default function api(config?: Configuration): DefaultApi {
  const auth = useAuthStore();

  const { isLoggedIn } = storeToRefs(auth);

  const defaultConfiguration = new Configuration({
    basePath: "/api",
    baseOptions: {
      headers: {
        Authorization: `Bearer ${auth.bearerToken?.bearerTokenEncoded}`,
        "Content-type": "application/json",
      },
    },
  });

  const finalConfiguration = config ? config : defaultConfiguration;

  const axiosInstance = axios.create();

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

        return Promise.reject(error);
      }
    }
  );

  return new DefaultApi(
    finalConfiguration,
    finalConfiguration.basePath,
    axiosInstance
  );
}
