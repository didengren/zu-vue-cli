import axios from "axios";
import store from "@/store";
// import router from "@/router";
import $loading from "vue-load-progress";

$loading.height = 3;
// axios 配置
axios.defaults.timeout = 15000;
// axios.defaults.withCredentials = true
console.log("process.env.NODE_ENV______", process.env.NODE_ENV);
console.log(
  "process.env.VUE_APP_SERVER_ADDRESS______",
  process.env.VUE_APP_SERVER_ADDRESS
);
axios.defaults.baseURL = process.env.VUE_APP_SERVER_ADDRESS;
// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    $loading.start();
    const token = store.state.globalMod.token;
    if (token)
      // eslint-disable-next-line standard/computed-property-even-spacing
      config.headers.common["Authorization"] = ~token.indexOf("bearer")
        ? token
        : `bearer ${token}`;
    else delete config.headers.common["Authorization"];
    return config;
  },
  (error) => {
    // todo list
    // e.g. 跳转登录页
    return Promise.reject(error);
  }
);
// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    $loading.done();
    return response;
  },
  (error) => {
    console.log("响应不是200:", error.message);
    $loading.done();
    // console.log('error', error.response)
    // console.log('error.config', error.config)
    // console.log('error.message', error.message)
    // console.log('error.code', error.code)
    // if (error.response) {
    // } else if (
    //   error.message.indexOf("timeout") > -1 ||
    //   error.message.indexOf("Network Error") > -1
    // ) {
    //   router.replace({
    //     name: "timeout",
    //     query: {
    //       redirect: router.currentRoute.fullPath
    //     }
    //   });
    // }
    return Promise.reject(error);
  }
);

export default axios;
