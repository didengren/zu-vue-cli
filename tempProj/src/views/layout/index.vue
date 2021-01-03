<template>
  <div :class="classObj" class="app-wrapper">
    <side-bar class="sidebar-container" />
    <div class="has-tags-view main-container">
      <div class="fixed-header">
        <navbar />
        <tags-bar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import AppMain from "./appMain";
import Navbar from "./navBar";
import SideBar from "./sideBar";
import TagsBar from "./tagsBar";
import { mapState } from "vuex";

export default {
  name: "layout",
  components: {
    AppMain,
    Navbar,
    SideBar,
    TagsBar
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.globalMod.sidebar
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened
      };
    }
  }
};
</script>

<style lang="less" scoped>
.app-wrapper {
  .clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - @sideBarWidth);
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}
</style>
