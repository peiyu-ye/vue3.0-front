<template>
  <div class="sider">
    <div class="logo">
      <h1>logo</h1>
    </div>
    <a-layout-sider
      :theme="data.theme"
      :collapsed="data.isCollapse"
      :trigger="null"
      collapsible
    >
      <template v-for="item in data.routes">
        <a-menu
          theme="dark"
          mode="inline"
          :key="item.name"
          v-if="!item.hidden"
          :inlineCollapsed="false"
          v-model:selectedKeys="data.selectedKeys"
          v-model:openKeys="data.openKeys"
        >
          <a-menu-item v-if="!item.children" :key="item.name">
            <router-link :to="item.path">
              <span>
                <AppstoreOutlined /> <span>{{ item.meta.title }}</span>
              </span>
            </router-link>
          </a-menu-item>
          <a-sub-menu v-else :key="item.name">
            <template v-slot:title>
              <span>
                <AppstoreOutlined /><span>{{ item.meta.title }}</span>
              </span>
            </template>

            <template v-for="subItem in item.children">
              <a-menu-item v-if="!subItem.hidden" :key="subItem.name">
                <router-link :to="subItem.path">
                  {{ subItem.meta.title }}
                </router-link>
              </a-menu-item>
            </template>
          </a-sub-menu>
        </a-menu>
      </template>
    </a-layout-sider>
  </div>
</template>

<script lang="ts">
import { reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
// ant-design2.0 需要一个个引用图标， 后面需重新封装icon方法
import { AppstoreOutlined } from "@ant-design/icons-vue";
export default {
  name: "lauout-sider",
  /** 父组件传过来的值 */
  props: {},
  /** 组件 */
  components: { AppstoreOutlined },
  setup() {
    interface DataType {
      theme: string;
      isCollapse: any;
      routes: any;
      selectedKeys: any;
      openKeys: any;
    }
    const store = useStore();
    const routers = useRouter();
    const route = useRoute();

    const data: DataType = reactive({
      theme: "light",
      isCollapse: store.state.app.isCollapse,
      routes: [],
      selectedKeys: [],
      openKeys: []
    });

    /** 声明周期函数 */
    data.isCollapse = computed(() => store.state.app.isCollapse);
    onMounted(() => {
      // 获取当前的全部路由
      // console.log("routers.options", routers.options.routes);
      // 目前只需要获取第一个数组的，因为都定义在第一个里面
      data.routes = routers.options.routes[0].children;
      // 获取当前地址栏对应的菜单情况
      // console.log(data.routes);
      // console.log("route", route.matched[0]);
      // 后面需要些个方法去掉需要隐藏的菜单栏。这里直接在组件判断了（后面需要改） v-if="!item.hidden"；
      data.selectedKeys.push(route.name);
      data.openKeys.push(route.matched[0].name);
    });
    /** 返回值 */
    return {
      data
    };
  }
};
</script>

<style lang="stylus" scoped>
body {
  margin: 0;
}

.sider {
  background-color: #011529;
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;

  h1 {
    color: #fff;
    text-align: center;
  }
}
</style>
