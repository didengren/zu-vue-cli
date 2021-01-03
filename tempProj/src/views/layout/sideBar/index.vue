<template>
  <div class="has-logo">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permissionRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Logo from "./logo";
import SidebarItem from "./sidebarItem";
import variables from "@/assets/style/base/variables.less";
import { Menu, Scrollbar } from "element-ui";

export default {
  components: {
    SidebarItem,
    Logo,
    [Menu.name]: Menu,
    [Scrollbar.name]: Scrollbar
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.globalMod.sidebar,
      permissionRoutes: (state) => state.permissionMod.routes
    }),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
