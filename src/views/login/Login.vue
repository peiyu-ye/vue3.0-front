<template>
  <div class="login">
    <div class="login-mask">
      <div class="login-form-wrap">
        <div class="login-form">
          <div class="login-form-content">
            <header>
              <!-- <img src="@/assets/logo.png" /> -->
              <h1>welcome 登录界面</h1>
            </header>
            <a-form :model="formData" :rules="formRules" ref="formRef">
              <a-form-item name="companyName">
                <a-input
                  size="large"
                  v-model:value="formData.companyName"
                  placeholder="请输入公司名称"
                />
              </a-form-item>
              <a-form-item name="account">
                <a-input
                  size="large"
                  v-model:value="formData.account"
                  placeholder="请输入用户名"
                />
              </a-form-item>
              <a-form-item name="password">
                <a-input-password
                  autofocus="autofocus"
                  size="large"
                  visibilityToggle
                  v-model:value="formData.password"
                  placeholder="请输入密码"
                />
              </a-form-item>
              <a-form-item>
                <a-button
                  type="primary"
                  size="large"
                  block
                  @click="login"
                  :loading="formState.loading"
                  >登录</a-button
                >
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/**
 * @reactive : 处理的是对象的双向绑定, 对象不能被解构或展开，一旦被解构或者展开，返回的值将失去响应式
 *
 * @ref : 处理js基础类型的双向绑定,其实ref的实现原理也只是对基础类型进行对象化封装，
 *        把数据放在{ value: 基础值 }里，再添加一个ref标识属性用来区分
 */
import { defineComponent, reactive, ref, unref, toRaw } from "vue";
import { useRouter, RouteLocationRaw } from "vue-router";
import { notification } from "ant-design-vue";
import API from "../../api/api";
import { Md5 } from "ts-md5";

export default defineComponent({
  /** 所有的代码逻辑将在setup方法中实现，并且不再有this */
  setup() {
    /** 返回值 */
    const formData = reactive({
      account: "",
      password: "",
      companyName: ""
    });
    const formRef = ref<any>(null);
    const formState = reactive({
      loading: false
    });
    const formRules = reactive({
      companyName: [
        { required: true, message: "请输入公司名称", trigger: "blur" }
      ],
      account: [{ required: true, message: "请输入账号", trigger: "blur" }],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        {
          pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,
          max: 12,
          min: 6,
          message: "密码应该在6-12长度之间字母和数字的组合",
          trigger: "blur"
        }
      ]
    });
    /** 路由 */
    const router = useRouter();
    const toPage = (path: RouteLocationRaw) => router.push(path);
    /** 方法 */
    async function handleLogin() {
      const form = unref(formRef);
      if (!form) return;
      formState.loading = true;
      try {
        const data = await form.validate();
        // 调用登录接口API
        // console.log("userInfo", userInfo);
        API.loginAPI
          .login(
            toRaw({
              companyName: data.companyName,
              password: Md5.hashStr(data.password),
              workerId: data.account
            })
          )
          .then(response => {
            console.log("loginInfo: ", response);
            localStorage.token = response.data.token;
            localStorage.login_userName = data.account;
            localStorage.login_companyName = data.companyName;

            toPage("/layout");
            setTimeout(() => {
              notification["success"]({
                message: "登录成功",
                description: "尊敬的" + data.account + "用户，欢迎回来！"
              });
            }, 500);
          })
          .catch(e => {
            console.log(e);
          });
      } catch (error) {
        notification["error"]({
          message: "登录失败",
          description: "请检查您的用户名或者密码是否正确！"
        });
      } finally {
        formState.loading = false;
      }
    }
    /** 返回值  */
    return {
      formRef,
      formData,
      formState,
      formRules,
      login: handleLogin
    };
  }
});
</script>
<style lang="stylus" scoped>
.login {
  position: relative;
  height: 100vh;
  background: url('../../assets/login/login-bg.png') no-repeat;
  background-size: 100% 100%;

  &-mask {
    height: 100%;
    background: url('../../assets/login/login-in.png') no-repeat;
    background-size: 100% 100%;
  }

  &-form {
    width: 32rem;
    background: rgba(255, 255, 255, 0.5);
    border: 10px solid rgba(255, 255, 255, 0.5);
    border-width: 10px;
    border-radius: 4px;
    background-clip: padding-box;
    position: absolute;
    right: 6%;
    top: 25%;
    box-shadow: 1px 2px 8px 4px #0387f1;

    &-wrap {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }

    &-content {
      width: 100%;
      height: 100%;
      border: 1px solid #999;
      border-radius: 2px;

      header {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          display: inline-block;
          width: 80px;
        }

        h1 {
          margin-top: 1rem;
          margin-bottom: 0;
          font-size: 24px;
          color: rgba(255, 255, 255, 1);
          text-align: center;
        }
      }

      form {
        width: 80%;
        margin-left: 10%;
        margin-top: 5%;
      }
    }
  }
}
</style>
