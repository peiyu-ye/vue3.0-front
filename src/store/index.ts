import { createStore } from "vuex";
import app from "./modules/app.js";
import user from "./modules/user";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    user
  },
  getters: {
    roles: (state: any) => state.user.roles,
    worker: (state: any) => state.user.worker,
  }
});
