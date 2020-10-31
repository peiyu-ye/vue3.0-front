/*
 * 登录接口
 * */
import services from "../../utils/axios/http";
import base from "./base"; // 导入接口域名列表

// 定义参数类型
type paramsType = {
  [key: string]: any;
};

const loginAPI = {
  // 登录
  login(params: paramsType) {
    return services.post(`${base.baseURL}/api/login`, params);
  },
  // 登出
  logout() {
    return services.post(`${base.baseURL}/api/logout`);
  },
  //
  getInfo() {
    return services.get(`${base.baseURL}/api/login/info`);
  }

};

export default loginAPI;