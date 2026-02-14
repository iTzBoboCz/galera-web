import {
  AuthConfig,
  UserInfo,
  UserInsert,
  UserLogin,
} from "@galera/client-axios";
import axios from "axios";
import { defineStore } from "pinia";

import api, { defaultConfiguration } from "~/composables/api";

export interface BearerToken {
  bearerTokenEncoded: string;
  bearerTokenRefreshedAt: number;
}

export interface ServerConfig {
  auth: AuthConfig;
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
      const response = await api(defaultConfiguration("noAuth"))
        .routesGetServerConfig()
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
      const response = await api(defaultConfiguration("noAuth"))
        .routesLogin({ userLogin })
        .then((r) => r.data)
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
    async signUp(newUser: UserInsert) {
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
        password: newUser.password ?? "",
      };

      await this.logIn(userLoginInfo);
    },
    async refreshToken(): Promise<boolean> {
      const response = await api(defaultConfiguration("noAuth"))
        .routesRefreshToken()
        .then((r) => r.data)
        .catch(() => {
          return;
        });

      if (!response) {
        this.userInfo = undefined;
        this.bearerToken = undefined;
        return false;
      }

      this.userInfo = response.user_info;
      this.bearerToken = {
        bearerTokenEncoded: response.bearer_token,
        bearerTokenRefreshedAt: Date.now(),
      };
      return true;
    },
    async logOut() {
      await api(defaultConfiguration("noAuth"))
        .routesLogout()
        .then((r) => r)
        .catch(() => {
          return;
        });

      this.userInfo = undefined;
      this.bearerToken = undefined;
    },
  },
  persist: false,
});
