<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
@import "./assets/iconfonts/iconfont.css";

* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  height: 100%;
}
#app {
  font-family: "Microsoft YaHei", "微软雅黑", "MicrosoftJhengHei", "华文细黑",
    "STHeiti";
  font-size: 14px;
  color: #2c3e50;
}
</style>
