import { Configuration, DefaultApi } from "@galera/client-axios";

import { useAuthStore } from "~/stores/auth";

export default function api(config?: Configuration): DefaultApi {
  const auth = useAuthStore();

  const defaultConfiguration = new Configuration({
    basePath: "/api",
    baseOptions: {
      headers: {
        Authorization: `Bearer ${auth.bearerToken?.bearerTokenEncoded}`,
        "Content-type": "application/json",
      },
    },
  });

  return new DefaultApi(config ? config : defaultConfiguration);
}
