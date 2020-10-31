/**
 * 对axios稍作封装
 * 1. 设置请求超时时间
 * 2. 添加请求拦截器，在每个请求的头部添加token
 * 3. 添加响应拦截器，根据服务器返回状态进行相应的结果返回
 */

import axiosObj, { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "../../store";
import vuex from "vuex";
import { message } from "ant-design-vue";

const blackKey = ["createTime", "updateTime", "structure", "options"];
const defaultConfig = {
  // baseURL在此处省略配置,考虑到项目可能由多人协作完成开发，域名也各不相同，此处通过对api的抽离，域名单独配置在base.ts中

  // 请求超时时间
  timeout: 10 * 1000,
  // 跨域请求时是否需要凭证
  // withCredentials: true, // Check cross-site Access-Control
  heards: {
    get: {
      // 设置默认请求头，当需要特殊请求头时，将其作为参数传入，即可覆盖此处的默认参数
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    post: {
      // 设置默认请求头，当需要特殊请求头时，将其作为参数传入，即可覆盖此处的默认参数(第三个参数即config)
      // 例如：
      //     services.post(`${base.BaseURL}/uploads/singleFileUpload`, file, {
      //       headers: { "Content-Type": "multipart/form-data" }
      //     });
      "Content-Type": "application/json;charset=utf-8"
    },
  },
  // 在向服务器发送请求前，对数据进行处理，axios默认会序列化数据 
  transformRequest:[function(data: any){
    // 把数据处理成FormData;
    if (data instanceof FormData) return data;
    // if (data.httpRequestType === "json") return data
    // Do whatever you want to transform the data
    let ret = "";
    for (const it in data) {
      if (
        data[it] !== undefined &&
        data[it] !== null &&
        blackKey.indexOf(it) === -1
      )
        ret +=
          encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
    }
    return ret;
  }],
  // 在传递给 then/catch 前，修改响应数据
  // transformResponse:[function(data){
  //
  // }]
};

/**
 * 请求失败后的错误统一处理，当然还有更多状态码判断，根据自己业务需求去扩展即可
 * @param status 请求失败的状态码
 * @param msg 错误信息
 */
const errorHandle = (status: number, msg: string) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      showMessage("用户未登录");
      // 跳转登录页
      break;
    // 403 token过期
    case 403:
      // 如果不需要自动刷新token，可以在这里移除本地存储中的token，跳转登录页
      showMessage("登录信息过期，请重新登录");
      logout();
      break;
    // 404请求不存在
    case 404:
      // 提示资源不存在
      showMessage("请求资源不存在");
      break;
    default:
      showMessage("请求数据失败,请稍后再试");
      console.log(msg);
  }
};

// 创建实例
const _axios = axiosObj.create(defaultConfig);

// 请求拦截器
_axios.interceptors.request.use(
  function(config: AxiosRequestConfig) {
    // 从vuex里获取token const token = store.state.token;
    // 如果token存在就在请求头里添加
    // localStorage.toke && (config.headers.token = localStorage.toke);
   
    if (localStorage.token) config.headers['token'] = localStorage.token // 让每个请求携带自定义token 请根据实际情况自行修改
    return config       

  },
  function(error) {
    // Do something with request error
    error.data = {};
    error.data.msg = "服务器异常";
    return Promise.reject(error);
  }
);
// 响应拦截器
_axios.interceptors.response.use(
  function(response: AxiosResponse) {
    const res = response.data;
    if (res) {
      if (typeof res === "string") {
        return res;
      } else if (res.dat && !res.err) {
        return res.dat;
      } else if (res.dat && res.err) {
        return Promise.reject(res);
      }
      res["Content-Disposition"] =
        response.headers["Content-Disposition"] ||
        response.headers["content-disposition"];
      if (res.code === 100004 || res.code === 600) {
        showMessage("登陆信息过期 !");
        logout();
      } else if (res.code === 100033) {
        return res;
      } else if (res.code !== 100000 && res.msg) {
        showMessage(res.msg);
        return Promise.reject(res);
      } else {
        return res;
      }
    } else {
      return Promise.reject(res);
    }
  },
  function(error) {
    if (error) {
      // 请求已发出，但不在2xx范围内
      errorHandle(error.status, error.data.msg);
      return Promise.reject(error);
    } else {
      // 断网
      return Promise.reject(error);
    }
  }
);

//弹框
function showMessage(msg: any) {
  message.error({
    content: msg,
    duration: 4,
  });
}
// 登出
function logout() {
  store.dispatch("user/toLogin").then(() => {
    location.reload();
  });
}

export default _axios;
