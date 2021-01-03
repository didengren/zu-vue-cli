import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import compose from "./tools/compose";
import { getToken, setToken } from "./tools/auth";
import "./registerServiceWorker";
import { Dialog } from "element-ui";
import "./components/common/digitalTable";
import "./assets/iconfonts/custom";

// import "element-ui/lib/theme-chalk/index.css";
import "./assets/style/base/element-variables.less";
import "./assets/style/base/index.less"; // global css
import "./assets/style/biz/index.less"; // business css

Dialog.props.closeOnClickModal.default = false;
Vue.config.productionTip = false;
Vue.prototype.iconBrand = process.env.VUE_APP_ICON_BRAND;

const queryTokenFromURI = (k) => {
  const hash = window.location.hash;
  const hashArr = hash.split("&");
  let res;
  hashArr.some((item) => {
    const pos = item.indexOf(`${k}=`);
    if (~pos) {
      res = item.slice(pos);
      return true;
    }
  });
  return res;
};

const tokenOriginHandler = () => {
  const tokenOrigin = queryTokenFromURI("access_token") || getToken();
  if (tokenOrigin) {
    console.log("Get token origin");
    setToken(tokenOrigin);
    store.commit("globalMod/TOKEN_MUT", tokenOrigin);
  }
};

function vmInitializer() {
  return new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount("#app");
}

const bootstrap = compose(tokenOriginHandler, vmInitializer);

bootstrap();
