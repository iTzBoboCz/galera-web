import { Configuration, DefaultApi } from "@galera/client-axios";

const token = "";

const configuration = new Configuration({
  basePath: "/api",
  baseOptions: {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  },
});

export default new DefaultApi(configuration);
