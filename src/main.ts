import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import AntDesignVue from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import api from "./api/api";

import "./style/global.styl";

const app = createApp(App);
app.config.globalProperties.$api = api;

app
  .use(store)
  .use(router)
  .use(AntDesignVue)
  .mount("#app");
