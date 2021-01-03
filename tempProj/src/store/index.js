import Vue from "vue";
import Vuex from "vuex";
import { debounce, throttle, getDirsTogether } from "@/tools/utils";

const modulesPath = require.context("./modules", true, /\.js$/);
const modules = getDirsTogether(modulesPath, {});

Vue.use(Vuex);

function cb(...args) {
  if (!(this instanceof Vuex.Store)) return;
  if (!!this.unsubscribeAction) this.unsubscribeAction();
  const that = this;
  this.unsubscribeAction = that.subscribeAction({
    before: (action, state) => {
      if (args[0] === action.type && typeof args[3] === "function")
        args[3](action, state);
    },
    after: (action, state) => {
      // console.log("action_____", that);
      if (args[0] === action.type && typeof args[2] === "function")
        args[2](action, state);
    }
  });
  return that.dispatch(...args);
}

Vuex.Store.prototype.deDispatch = debounce(
  cb,
  process.env.VUE_APP_DEBOUNCE_WAIT
);

Vuex.Store.prototype.thDispatch = throttle(
  cb,
  process.env.VUE_APP_THROTTLE_WAIT
);

export default new Vuex.Store({
  modules: modules
});
