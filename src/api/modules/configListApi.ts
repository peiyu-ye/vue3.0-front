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
  
  /** 任务列表 */
  // /api/hrm/range/worker
  getWorker(){
    return services.get(`${base.crmBaseURL}/api/hrm/range/worker`);
  },
  // api/config/groupcall/task/list
  getTaskList(params: paramsType) {
    // return services.get(`${base.crmBaseURL}/api/config/groupcall/task/list?sortField=${params.sortField}&order=${params.order}&page=${params.page}&pageSize=${params.pageSize}`);
    return services.get(`${base.crmBaseURL}/api/config/groupcall/task/list`,params);
  },

  // 上传录音文件 /api/config/groupcall/upload/record
  uploadRecord(params: paramsType,config: any) {
    return services.post(
      `${base.crmBaseURL}/api/config/groupcall/upload/record`,
      params,
      config
    );
  },
  // 新增
  addTask(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/groupcall/task/add`,
      params
    );
  },
  //删除 
  deleteTask(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/groupcall/task/delete`,
      params
    );
  },
  //获取行详情数据
  detailTask(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/groupcall/task/detail`,
      params
    );
  },
  // 更新
  updateTask(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/groupcall/task/update`,
      params
    );
  },
  // 被叫状态
  getCallStatus() {
    return services.get(`${base.crmBaseURL}/api/config/groupcall/callee/status`);
  },
  // 获取呼叫详情
  getCalleeList(params: paramsType) {
    return services.get(`${base.crmBaseURL}/api/config/groupcall/task/callee/list`,params);
  },
  // '/api/config/groupcall/start'
  startStatus(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/groupcall/start`,
      params
    );
  },
  // '/api/config/groupcall/stop'
  stopStatus(params: paramsType) {
    return services.post(
      `${base.crmBaseURL}/api/config/groupcall/stop`,
      params
    );
  },
  /** 通话记录 */
  ///api/config/groupcall/record/list
  getRecordList(params: paramsType) {
    return services.get(`${base.crmBaseURL}/api/config/groupcall/record/list`,params)
  },
  // 接通状态
  getOnStatus() {
    return services.get(`${base.crmBaseURL}/api/config/groupcall/record/status`);
  },
  // 下载录音 /api/config/groupcall/record/download
  download(params: paramsType) {
    return services(
      {
        url: '/api/config/groupcall/record/download',
        method: 'get',
        params: params,
        responseType: 'blob'
      }
    );
  },

};

export default configAPI;
