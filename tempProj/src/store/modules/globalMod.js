import Cookies from "js-cookie";
import { userMsgAPI } from "@/http/portal";
import getToken from "@/common/getToken";
import { setToken, removeToken } from "@/tools/auth";
import { resetRouter } from "@/router";
import { Message } from "element-ui";

const authReformFn = (authModel, item) => {
  if (~item.indexOf("sys:")) {
    let newArr = item.split(":").slice(1);
    if (newArr.length === 1) authModel.menu.push(newArr.join(":"));
    if (newArr.length === 2) authModel.tag.push(newArr.join(":"));
    if (newArr.length === 3) authModel.btn.push(newArr.join(":"));
  }
  return authModel;
};

function reorganizedAuthMenu(payload) {
  let bm = [...payload.menus];
  const authModel = bm.reduce(authReformFn, { menu: [], tag: [], btn: [] });
  return {
    userType: payload.userType,
    authModel,
    realname: payload.realName
  };
}

export default {
  namespaced: true,
  state: () => ({
    token: null,
    userMsg: {},
    sidebar: {
      opened: Cookies.get("sidebarStatus")
        ? !!+Cookies.get("sidebarStatus")
        : true
    }
  }),
  mutations: {
    TOKEN_MUT(state, payload) {
      state.token = payload;
    },
    USER_INFO_MUT(state, payload) {
      state.userMsg = payload.menus ? reorganizedAuthMenu(payload) : payload;
    },
    TOGGLE_SIDEBAR_MUT: (state) => {
      state.sidebar.opened = !state.sidebar.opened;
      if (state.sidebar.opened) {
        Cookies.set("sidebarStatus", 1);
      } else {
        Cookies.set("sidebarStatus", 0);
      }
    }
  },
  actions: {
    USER_INFO_ACT({ commit, dispatch, state }, payload) {
      return userMsgAPI();
    },
    TOGGLE_SIDEBAR_ACT({ commit }) {
      commit("TOGGLE_SIDEBAR_MUT");
    },
    // 登录
    LOGIN_ACT({ commit, dispatch }, userInfo) {
      const { username, password } = userInfo;
      return new Promise((resolve, reject) => {
        getToken({ username: username.trim(), password: password }).then(
          (res) => {
            if (res) {
              console.log("Get token origin");
              setToken(res);
              commit("TOKEN_MUT", res);
            }
            resolve();
          },
          (err) => {
            if (err.bizcode === 60002) {
              Message.error("token错误或者已失效");
            }
            removeToken();
            commit("TOKEN_MUT", null);
            reject(err);
          }
        );
      });
    },
    // 退出登录
    LOGOUT_ACT({ commit, state, dispatch }) {
      commit("TOKEN_MUT", null);
      commit("USER_INFO_MUT", {});
      removeToken();
      resetRouter();

      // reset visited views and cached views
      return dispatch("tagsMod/delAllViews", null, {
        root: true
      });
    }
  },
  getters: {}
};
