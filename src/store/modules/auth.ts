import {
  LoginResponse,
  NewUser,
  UserInfo,
  UserLogin,
} from "@galera/client-axios";
import axios from "axios";
import { ActionTree, GetterTree, MutationTree } from "vuex";

import { RootState } from "..";

export interface BearerToken {
  bearerTokenEncoded: string;
  bearerTokenRefreshedAt: number;
}

export interface AuthState {
  userInfo?: UserInfo;
  bearerToken?: BearerToken;
}

export const state = (): AuthState => ({});

const getters: GetterTree<AuthState, RootState> = {
  getBearerToken: (state): BearerToken | undefined => {
    return state.bearerToken;
  },
  isLoggedIn: (state): boolean => {
    return state.userInfo && state.bearerToken ? true : false;
  },
};

const actions: ActionTree<AuthState, RootState> = {
  async logIn({ commit }, userLogin: UserLogin) {
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
      commit("logIn", {
        userInfo: response.user_info,
        bearerToken: response.bearer_token,
      });
    }
  },
  async signUp({ commit }, newUser: NewUser) {
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

    await this.dispatch("auth/logIn", userLoginInfo);
  },
  // TODO: not implemented
  async refreshToken({ commit }) {
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
      commit("refreshToken", {
        bearerToken: bearerToken.encoded_claims,
      });
    }
  },
  async logOut({ commit }) {
    commit("logOut");
  },
};

const mutations: MutationTree<AuthState> = {
  logIn(
    state,
    { userInfo, bearerToken }: { userInfo: UserInfo; bearerToken: string }
  ) {
    state.userInfo = userInfo;
    state.bearerToken = {
      bearerTokenEncoded: bearerToken,
      bearerTokenRefreshedAt: Date.now(),
    };
  },
  logOut(state) {
    state.userInfo = undefined;
    state.bearerToken = undefined;
  },
  refreshToken(state, { bearerToken }: { bearerToken: string }) {
    state.bearerToken = {
      bearerTokenEncoded: bearerToken,
      bearerTokenRefreshedAt: Date.now(),
    };
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
