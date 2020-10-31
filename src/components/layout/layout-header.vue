<template>
  <a-layout-header class="header" :style="{ background: '#fff' }">
    <div class="header-wrap">
      <div class="header-left" @click="toggleCollapse">
        <MenuUnfoldOutlined v-if="data.isCollapse" class="icon" />
        <MenuFoldOutlined v-else class="icon" />
      </div>
      <div class="header-right">
        <!-- 用户中心 -->
        <HeaderUserCenter />
      </div>
    </div>
  </a-layout-header>
</template>

<script lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import HeaderUserCenter from "@c/layoutHeader/user/headerUserCenter.vue";
import { reactive, computed } from "vue";
import { useStore } from "vuex";
export default {
  name: "LayoutHeader",
  /** 父组件传过来的值 */
  props: {},
  /** 组件 */
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HeaderUserCenter
  },
  setup() {
    const store = useStore();
    const data = reactive({
      isCollapse: store.state.app.isCollapse
    });

    const toggleCollapse = () => {
      store.commit("app/SET_COLLAPSE");
    };
    data.isCollapse = computed(() => store.state.app.isCollapse);

    /** 返回值 */
    return { data, toggleCollapse };
  }
};
</script>

<style lang="stylus" scoped>
.header {
  background: '#fff';
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.1);
}

.header-wrap {
  height: 64px;

  .header-left, .header-right {
    display: inline-block;

    > * {
      display: inline-block;
    }

    .icon {
      width: 2.5rem;
      height: 1.5rem;

      svg {
        width: 2.5rem;
        height: 1.5rem;
      }
    }
  }
}

.header-right {
  position: fixed;
  right: 0;
  padding-right: 20px;

  > * {
    padding: 0 20px;

    &:hover {
      background-color: rgb(249, 249, 249);
      cursor: pointer;
    }
  }
}
</style>
