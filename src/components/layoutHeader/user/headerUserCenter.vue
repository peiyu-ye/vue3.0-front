<template>
  <div class="user-center">
    <a-dropdown :trigger="['click']">
      <a class="user" @click="e => e.preventDefault()">
        <a-avatar class="user-avatar" src="../assets/logo.png" />
        <span> {{ storage.name }} </span>
      </a>
      <template v-slot:overlay>
        <a-menu class="uer-center-items">
          <a-menu-item>
            <router-link to="/userCenter">个人中心</router-link>
          </a-menu-item>
          <a-menu-item>
            <router-link to="/changePassword">修改密码</router-link>
          </a-menu-item>
          <!-- <a-divider></a-divider> -->
          <a-menu-item>
            <!-- <router-link to="/login">退出登录</router-link> -->
            <a @click="logout">退出登录</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import { reactive } from "vue";
import { useStore } from "vuex";
export default {
  name: "",
  /** 父组件传过来的值 */
  props: {},
  /** 组件 */
  components: {},
  setup() {
    const callback = (key: unknown) => {
      console.log("key", key);
    };
    const storage = reactive({ name: localStorage.login_userName });
    const store = useStore();
    const logout = () => {
      store.dispatch("user/logout");
    };
    /** 返回值 */
    return { callback, storage, logout };
  }
};
</script>

<style lang="stylus" scoped>
.user {
  font-size: 14px;
  color: black;
  line-height: 50px;

  .user-avatar {
    margin-top: -8px;
  }
}

.uer-center-items {
  margin-top: 15px;

  > * {
    padding: 5 20px;
  }
}
</style>
