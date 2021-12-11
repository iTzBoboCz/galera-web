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

export interface AuthState {
  userInfo?: UserInfo;
  bearerToken?: BearerToken;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    userInfo: undefined,
    bearerToken: undefined,
  }),
  getters: {
    isLoggedIn: (state) => (state.userInfo && state.bearerToken ? true : false),
  },
  actions: {
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
    // TODO: not implemented
    async refreshToken() {
      // const bearerToken = await api
      //   .routesRefreshToken()
      //   .then((response) => {
      //     return response.data;
      //   })
      //   .catch(() => {
      //     return;
      //   });
      // TODO: fix rocket
      const bearerToken = await axios
        .post("/api/login/refresh")
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
      }
    },
    async logOut() {
      this.userInfo = undefined;
      this.bearerToken = undefined;
    },
  },
  persist: true,
});
