import Vue from "vue";
import VueRouter from "vue-router";
import { getDirsTogether, transMapToList } from "@/tools/utils";
import { removeToken, getCachedUser, setCachedUser } from "@/tools/auth";
import store from "@/store";

// https://www.jianshu.com/p/1e462d9b0c03
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

const modulesPath = require.context("./modules", true, /\.js$/);
const modules = getDirsTogether(modulesPath, {});

Vue.use(VueRouter);

const layout = () => import("@/views/layout");
/**
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will not be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login")
  },
  {
    path: "/",
    component: layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard"),
        name: "Dashboard",
        meta: { title: "首页", icon: "el-icon-s-home", affix: true }
      }
    ]
  }
];

export const asyncRoutes = [].concat(...transMapToList(modules));

const createRouter = () =>
  new VueRouter({
    mode: "hash",
    base: process.env.BASE_URL,
    routes: constantRoutes
    // scrollBehavior(to, from, savedPosition) {
    //   console.log("savedPosition_____", savedPosition);
    //   if (savedPosition) {
    //     return savedPosition;
    //   } else {
    //     return {
    //       x: 0,
    //       y: 0
    //     };
    //   }
    // }
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

router.beforeEach(async (to, from, next) => {
  const { token, userMsg } = store.state.globalMod;
  if (token) {
    console.log("There is a token in store");

    if (userMsg.authModel) {
      console.log("There is a authModel in store");

      const cachedUser = getCachedUser();
      console.log("cachedUser_", cachedUser);
      if (~to.path.indexOf("/login") || !isSameUser(userMsg.id, cachedUser))
        next({ path: "/" });
      else next();
    } else {
      console.log("No authModel in store");

      try {
        await getUserInfo();
        await confirmMenu();

        // https://github.com/vueComponent/ant-design-vue-pro/issues/714
        next({ ...to, replace: true });
      } catch (error) {
        resetTokenInStore();
        next(`/login?redirect=${to.path}`);
      }
    }
  } else {
    console.log("No token in store");

    if (~to.path.indexOf("/login")) next();
    else next(`/login?redirect=${to.path}`);
  }
});

// 获取用户信息
const getUserInfo = async () => {
  const resp = await store.dispatch("globalMod/USER_INFO_ACT").catch((err) => {
    if (err.bizcode === 60002) throw err;
  });
  store.commit("globalMod/USER_INFO_MUT", resp.data);

  return resp;
};

const confirmMenu = async () => {
  const accessedRoutes = await store.dispatch(
    "permissionMod/generateRoutes",
    store.state.globalMod.userMsg.authModel
  );
  router.addRoutes(accessedRoutes);

  return accessedRoutes;
};

const isSameUser = (n, o) => {
  const isSame = n === o;
  if (!isSame) setCachedUser(n);
  return isSame;
};

const resetTokenInStore = () => {
  removeToken();
  store.commit("globalMod/TOKEN_MUT", null);
};

export default router;
