<template>
  <div class="login-container">
    <div class="login-form">
      <div class="title-container">
        <h3 class="title">质量巡检管理系统</h3>
      </div>

      <div class="tab-wrap">
        <el-tabs stretch v-model="activeName" @tab-click="handleTab">
          <!-- <el-tab-pane label="手机登录" name="first">手机登录</el-tab-pane> -->
          <el-tab-pane label="账号密码登录" name="second">
            账号密码登录
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- <el-form
        v-show="activeName === 'first'"
        ref="loginForm1"
        :model="loginForm1"
        :rules="loginRules1"
        autocomplete="on"
        label-position="left"
      >
        <div class="form-wrap form-2">
          <el-form-item prop="phone">
            <el-input size="small"
              ref="phone"
              v-model="loginForm1.phone"
              placeholder="请输入手机号"
              name="phone"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="sms">
            <el-input size="small"
              ref="sms"
              v-model="loginForm1.sms"
              placeholder="请输入手机验证码"
              name="sms"
              type="text"
              tabindex="2"
              autocomplete="on"
              style="width: 75%"
              @keyup.enter.native="handleLogin1"
            />
            <el-button
              class="sms-btn"
              :class="smsBtnText === '获取验证码' ? '' : 'forbidden'"
              v-text="smsBtnText"
              size="small"
              @click="onSMS"
              plain
            ></el-button>
          </el-form-item>
        </div>
        <el-button
          :loading="loading1"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin1"
        >
          登&nbsp;录
        </el-button>
      </el-form> -->
      <el-form
        v-show="activeName === 'second'"
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        autocomplete="on"
        label-position="left"
      >
        <div class="form-wrap form-1">
          <el-form-item prop="username">
            <span class="svg-container">
              <i class="el-icon-user"></i>
            </span>
            <el-input
              size="small"
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip
            v-model="capsTooltip"
            content="Caps lock is On"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <span class="svg-container">
                <i class="el-icon-lock"></i>
              </span>
              <el-input
                size="small"
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
          </el-tooltip>
        </div>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >
          登&nbsp;录
        </el-button>

        <!-- <div style="position:relative">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">Username : editor</span>
          <span>Password : any</span>
        </div>
      </div> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  Form,
  FormItem,
  Button,
  Input,
  Tooltip,
  Tabs,
  TabPane
} from "element-ui";
// import { validUsername } from "@/tools/validator";
import { telVerify } from "@/tools/utils";
const TIME_COUNT = 60;

export default {
  name: "login",
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Button.name]: Button,
    [Tooltip.name]: Tooltip,
    [Input.name]: Input,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      //   callback(new Error("请输入正确的用户名"));
      // } else {
      //   callback();
      // }
      if (value) callback();
      else callback(new Error("用户名不能为空"));
      callback();
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码格式错误"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, cb) => {
      let res = telVerify(value);
      if (res.code) cb();
      else cb(new Error(res.msg));
    };
    const validateSMS = (rule, value, cb) => {
      if (value && /^[0-9]+.?[0-9]*$/.test(value)) cb();
      else cb(new Error("验证码格式错误"));
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginForm1: {
        phone: "",
        sms: ""
      },
      activeName: "second",
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loginRules1: {
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        sms: [{ required: true, trigger: "blur", validator: validateSMS }]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      loading1: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      count: "",
      timer: null
    };
  },
  computed: {
    smsBtnText() {
      if (this.count > 0 && this.count <= TIME_COUNT) return this.count + "S";
      else return "获取验证码";
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    },
    activeName(n, o) {
      if (n === "first") this.resetForm2();
      else if (n === "second") this.resetForm1();
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    // if (this.loginForm1.phone === "") {
    //   this.$refs.phone.focus();
    // } else if (this.loginForm1.sms === "") {
    //   this.$refs.sms.focus();
    // }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    resetForm1() {
      // this.loginForm.username = "";
      // this.loginForm.password = "";
      this.$refs.loginForm.resetFields();
    },
    resetForm2() {
      // this.loginForm1.phone = "";
      // this.loginForm1.sms = "";
      this.$refs.loginForm1.resetFields();
    },
    handleTab(tab, e) {},
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("globalMod/LOGIN_ACT", this.loginForm)
            .then(
              () => {
                this.$router.push({
                  path: this.redirect || "/",
                  query: this.otherQuery
                });
                this.loading = false;
              },
              () => {
                this.loading = false;
              }
            )
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleLogin1() {
      this.$refs.loginForm1.validate((valid) => {
        if (valid) {
          this.loading1 = true;
          this.$store
            .dispatch("globalMod/LOGIN_ACT", {
              username: this.loginForm1.phone,
              password: this.loginForm1.sms
            })
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery
              });
              this.loading1 = false;
            })
            .catch(() => {
              this.loading1 = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
};
</script>

<style lang="less">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

@bg: #283443;
@light_gray: #fff;
@cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: @cursor)) {
  .login-container .el-input input {
    color: @cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: @light_gray;
      height: 47px;
      caret-color: @cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px @bg inset !important;
        -webkit-text-fill-color: @cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    .sms-btn {
      position: absolute;
      right: 7px;
      top: 8px;
      background: transparent;
      border: 1px solid #faa00a;
      color: #faa00a;
      &.forbidden {
        pointer-events: none;
      }
      &:hover {
        background: transparent;
        border: 1px solid #faa00a;
        color: #faa00a;
      }
    }
  }
}
</style>

<style lang="less">
@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: @bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: @dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: @light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: @dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .tab-wrap {
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__active-bar {
      background-color: #fff;
    }
    .el-tabs__item {
      color: #fff;
      opacity: 0.7;
      &:hover,
      &.is-active {
        color: #fff;
        opacity: 1;
      }
    }
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
