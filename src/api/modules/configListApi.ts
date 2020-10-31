/*
 * 登录接口
 * */
import services from "../../utils/axios/http";
import base from "./base"; // 导入接口域名列表

// 定义参数类型
type paramsType = {
  [key: string]: any;
};

const configAPI = {
  //  线路号码(含线路信息)
  getTrunknumber() {
    return services.get(`${base.crmBaseURL}/api/trunk/trunknumber/tree`);
  },
  // 主叫分组列表
  callerGroupList() {
    return services.get(`${base.crmBaseURL}/api/config/caller/group/list`);
  },
  // 添加主叫分组
  callerGroupAdd(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/caller/group/add`,
      params
    );
  },
  // 删除主叫分组
  deleteCallerGroup(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/caller/group/delete`,
      params
    );
  },
  // 修改主叫分组
  updateCallerGroup(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/caller/group/update`,
      params
    );
  },
  /** -----------------------坐席---------------------------- */
  // /api/config/seats/group/find 坐席组列表
  seatsGroupList() {
    return services.get(`${base.crmBaseURL}/api/config/seats/group/find`);
  },
  // /api/config/seats/group/add 添加坐席组
  seatsGroupAdd(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/seats/group/add`,
      params
    );
  },
  // /api/config/seats/group/delete 删除坐席组
  seatsGroupDelete(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/seats/group/delete`,
      params
    );
  },
  // /api/config/seats/group/update 修改坐席组
  seatsGroupUpdate(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/seats/group/update`,
      params
    );
  },
  // /api/hrm/range/worker
  getWorker(){
    return services.get(`${base.crmBaseURL}/api/hrm/range/worker`);
  }

};

export default configAPI;
