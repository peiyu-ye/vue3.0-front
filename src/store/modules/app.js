// state: 储存初始化数据，取值：store.state.xxx
const state = {
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false
};
// getter： 对state里的数据进行二次处理,类似于computed,取值：store.getters.xxx
const getters = {};
// 对数据进行计算的方法，在页面中触发时使用,调用：store.commit('方法名',value)，同步，不能回调
const mutations = {
  SET_COLLAPSE(state) {
    state.isCollapse = !state.isCollapse;
    // 将状态存储到本地
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  }
};
// 处理mutations中已经写好的方法,处理异步操作,可以回调
const actions = {};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
