import API from "../../api/api";

const state = {
  worker: {},
  roles: [],
};

const mutations = {
  SET_WORKER: (state: any, worker: any) => {
    state.worker = worker;
  },
  SET_ROLES: (state: any, roles: any) => {
    state.roles = roles;
  },
};

const actions = {
  // get user info
  getInfo(state: any) {
    let commit: (arg0: string, arg1: any[]) => void;
    return new Promise((resolve, reject) => {
      API.loginAPI
        .getInfo()
        .then((response) => {
          const { data } = response;
          console.log("response---------data:      ", data);
          if (!data) {
            reject("获取信息失败，请重新登录");
          } else {
            const { menus, actions, worker, range } = data;
            worker.range = range;
            // menus must be a non-empty array
            if (!menus || menus.length <= 0) {
              reject("此账号无任何页面权限");
            } else {
              if (process.env.NODE_ENV === "development")
                commit("SET_ROLES", [
                  ...menus,
                  ...actions.map((item: any) => item.actionUri),
                  "development",
                ]);
              else
                commit("SET_ROLES", [
                  ...menus,
                  ...actions.map((item: any) => item.actionUri),
                ]);
              commit("SET_WORKER", worker);
              sessionStorage.workerId = worker.workerId;
              resolve(state.roles);
            }
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // user logout
  logout() {
    API.loginAPI
      .logout()
      .then(() => {
        localStorage.token = "";        
        location.reload();
      })
      .catch(() => {
        localStorage.token = "";
        location.reload();
      });
  },

  // remove token
  toLogin() {
    localStorage.token = "";
    location.reload();
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
