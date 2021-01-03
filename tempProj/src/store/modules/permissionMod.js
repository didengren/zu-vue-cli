import { asyncRoutes, constantRoutes } from "@/router";

/**
 * index of model keys
 * @param {number} level
 */
function getModelProp(level) {
  return ["menu", "tag", "btn"][level];
}

/**
 * Use meta.role to determine if the current user has permission
 * @param route
 * @param model
 * @param prop name of model key
 */
function hasPermission(route, model, prop) {
  if (route.meta && route.meta.role) {
    return model[prop].includes(route.meta.role);
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param model
 * @param level index of model keys
 */
export function filterAsyncRoutes(routes, model, level) {
  const res = [];
  routes.forEach((route) => {
    // console.log("menu_", route);
    level = route.meta.role.split(":").length - 1;
    const routeCP = { ...route };
    const prop = getModelProp(level);
    if (hasPermission(routeCP, model, prop)) {
      if (routeCP.children)
        routeCP.children = filterAsyncRoutes(
          routeCP.children,
          model,
          (level += 1)
        );
      res.push(routeCP);
    }
  });

  return res;
}

const state = {
  routes: [],
  addRoutes: []
};

const mutations = {
  SET_ROUTES: (state, accessedRoutes) => {
    state.addRoutes = accessedRoutes;
    state.routes = constantRoutes.concat(accessedRoutes);
  }
};

const actions = {
  generateRoutes({ commit }, authModel) {
    return new Promise((resolve) => {
      let accessedRoutes = filterAsyncRoutes(asyncRoutes, authModel, 0);
      commit("SET_ROUTES", accessedRoutes);
      resolve(accessedRoutes);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
