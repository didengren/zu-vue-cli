<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <span>您好！{{ $store.state.globalMod.userMsg.realname }}</span>
      <i class="logout-btn el-icon-switch-button" @click="logout"></i>
      <!-- <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Breadcrumb from "./breadcrumb";
import Hamburger from "./hamburger";
import { Dropdown, DropdownMenu, DropdownItem } from "element-ui";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  computed: {
    ...mapState("globalMod", ["sidebar", "avatar"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("globalMod/TOGGLE_SIDEBAR_ACT");
    },
    async logout() {
      await this.$store.dispatch("globalMod/LOGOUT_ACT");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="less" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    // transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    & > span {
      vertical-align: middle;
      border-right: 1px solid #ebebeb;
      padding-right: 12px;
      color: #888;
    }

    .logout-btn {
      margin-left: 12px;
      margin-right: 8px;
      font-size: 22px;
      vertical-align: middle;
      cursor: pointer;
      color: #888;
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        // transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
