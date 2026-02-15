import {
  AuthConfig,
  UserInfo,
  UserInsert,
  UserLogin,
} from "@galera/client-axios";
import axios from "axios";
import { defineStore } from "pinia";

import api, { defaultConfiguration } from "~/composables/api";

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes (same as backend)

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
  sessionReady?: boolean; // undefined = new page load, false = logged out/failed, true = logged in
  tokenRefreshPending?: Promise<boolean>;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    serverConfig: undefined,
    userInfo: undefined,
    bearerToken: undefined,
    sessionReady: undefined,
    tokenRefreshPending: undefined,
  }),
  getters: {
    isLoggedIn: (state) => state.sessionReady === true,
    isTokenFresh: (state) => {
      if (!state.bearerToken?.bearerTokenEncoded) return false;

      const age = Math.max(
        0,
        Date.now() - state.bearerToken.bearerTokenRefreshedAt
      ); // in case bearerTokenRefreshedAt is in the future
      return age < ACCESS_TOKEN_TTL_MS * 0.01; // refresh at 80% of ACCESS_TOKEN_TTL_MS
    },
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
        this.sessionReady = true;
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
        this.sessionReady = false;
        return false;
      }

      this.userInfo = response.user_info;
      this.bearerToken = {
        bearerTokenEncoded: response.bearer_token,
        bearerTokenRefreshedAt: Date.now(),
      };
      this.sessionReady = true;
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
      this.sessionReady = false;
      this.tokenRefreshPending = undefined;
    },
    async sessionBootstrap(): Promise<boolean> {
      if (this.sessionReady !== undefined) return this.sessionReady;

      return await this.refreshTokenOnce();
    },
    async ensureFreshToken(): Promise<boolean> {
      if (this.sessionReady === undefined) await this.sessionBootstrap();
      if (this.sessionReady !== true) return false; // if sessionReady is false or undefined
      if (this.isTokenFresh) return true;

      return await this.refreshTokenOnce();
    },
    async refreshTokenOnce(): Promise<boolean> {
      if (!this.tokenRefreshPending) {
        this.tokenRefreshPending = this.refreshToken().finally(() => {
          this.tokenRefreshPending = undefined;
        });
      }

      return this.tokenRefreshPending;
    },
  },
  persist: false,
});
