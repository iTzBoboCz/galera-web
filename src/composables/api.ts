import { Configuration, DefaultApi } from "@galera/client-axios";
import { createNamespacedHelpers } from "vuex-composition-helpers";

import { store } from "~/store/index";

export default function api(config?: Configuration): DefaultApi {
  const { useState } = createNamespacedHelpers(store, "auth");
  const { bearerToken } = useState(["bearerToken"]);

  const defaultConfiguration = new Configuration({
    basePath: "/api",
    baseOptions: {
      headers: {
        Authorization: `Bearer ${bearerToken.value?.bearerTokenEncoded}`,
        "Content-type": "application/json",
      },
    },
  });

  return new DefaultApi(config ? config : defaultConfiguration);
}
