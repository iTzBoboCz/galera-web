import {
  LoginResponse,
  NewUser,
  UserInfo,
  UserLogin,
} from "@galera/client-axios";
import axios from "axios";
import { defineStore } from "pinia";

export interface BearerToken {
  bearerTokenEncoded: string;
  bearerTokenRefreshedAt: number;
}

export interface ServerConfig {
  auth: AuthConfig;
}

export interface AuthConfig {
  oidc: ProviderConfig[];
}

export interface ProviderConfig {
  key: string;
  display_name: string;
  login_url: string;
}

export interface AuthState {
  serverConfig?: ServerConfig;
  userInfo?: UserInfo;
  bearerToken?: BearerToken;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    serverConfig: undefined,
    userInfo: undefined,
    bearerToken: undefined,
  }),
  getters: {
    isLoggedIn: (state) => (state.userInfo && state.bearerToken ? true : false),
  },
  actions: {
    async getServerConfig() {
      const response = await axios
        .get<ServerConfig>("/api/public/config", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          return response.data;
        })
        .catch(() => {
          return;
        });

      if (response) {
        this.serverConfig = { auth: response.auth };
        console.error(this);
      }
    },
    async logIn(userLogin: UserLogin) {
      // Doesn't work because server doesn't accept stringified JSON objects.
      // issue: https://github.com/OpenAPITools/openapi-generator/issues/5717
      // const response = await api.routesLogin({ userLogin }).then((response) => {
      const response = await axios
        .post<LoginResponse>("/api/login", userLogin, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          return response.data;
        })
        .catch(() => {
          return;
        });

      if (response) {
        this.userInfo = response.user_info;
        this.bearerToken = {
          bearerTokenEncoded: response.bearer_token,
          bearerTokenRefreshedAt: Date.now(),
        };
        console.error(this);
      }
    },
    async signUp(newUser: NewUser) {
      // Doesn't work because server doesn't accept stringified JSON objects.
      // issue: https://github.com/OpenAPITools/openapi-generator/issues/5717
      // const success = await api.routesCreateUser({ userRegisterInfo: userRegisterInfo }).then(() => {
      const success = await axios
        .post("/api/user", newUser, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });

      if (!success) {
        return;
      }

      const userLoginInfo: UserLogin = {
        username_or_email: newUser.username,
        password: newUser.password,
      };

      await this.logIn(userLoginInfo);
    },
    async refreshToken() {
      const bearerToken = await axios
        .post(
          "/api/login/refresh",
          {
            encoded_claims: this.bearerToken?.bearerTokenEncoded,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch(() => {
          return;
        });

      if (bearerToken) {
        this.bearerToken = {
          bearerTokenEncoded: bearerToken.encoded_claims,
          bearerTokenRefreshedAt: Date.now(),
        };
      } else {
        await this.logOut();
      }
    },
    async logOut() {
      this.userInfo = undefined;
      this.bearerToken = undefined;
    },
  },
  persist: true,
});
