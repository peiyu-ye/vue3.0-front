<template>
  <div class="configListMian">
    <div class="configListMian-top">
      <div class="configListMian-top-left">
        <a-button type="primary" @click="handleModal('add')">
          新增
        </a-button>
        <a-modal
          :visible="visibleState.modalVisible"
          :title="visibleState.modalTitle ? '新增' : '修改'"
          width="860px"
          cancelText="取消"
          okText="确定"
          @cancel="visibleState.modalVisible = false"
          @ok="handleAddUpdate"
          class="deepAntTable"
        >
          <a-form
            ref="ruleForm"
            :model="formData"
            :rules="rules"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-row>
              <a-divider>基础配置</a-divider>
              <a-col :span="12">
                <a-form-item label="任务名称：" name="taskName">
                  <a-input v-model:value="formData.taskName" />
                </a-form-item>
                <a-form-item label="主叫号码组：" name="callerGroupId">
                  <a-select
                    v-model:value="formData.callerGroupId"
                    style="width: 100%"
                    placeholder="请选择"
                    @focus="getWorker"
                    :dropdownMenuStyle="{
                      'max-height': '140px'
                    }"
                    :allowClear="true"
                  >
                    <template v-for="(option, i) in datas.selectData" :key="i">
                      <a-select-option
                        :value="option.value"
                        :label="option.label"
                      >
                        {{ option.label }}
                      </a-select-option>
                    </template>
                  </a-select>
                </a-form-item>
                <a-form-item label="呼叫轮数：" name="repeatCount">
                  <a-input v-model:value="formData.repeatCount" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="坐席组：" name="seatsId">
                  <a-select
                    v-model:value="formData.seatsId"
                    style="width: 100%"
                    placeholder="请选择"
                    @focus="getSeatsGroupList"
                    :dropdownMenuStyle="{
                      'max-height': '140px'
                    }"
                    :allowClear="true"
                  >
                    <template v-for="(option, i) in datas.seatsData" :key="i">
                      <a-select-option
                        :value="option.value"
                        :label="option.label"
                      >
                        {{ option.label }}
                      </a-select-option>
                    </template>
                  </a-select>
                </a-form-item>
                <a-form-item
                  v-if="visibleState.modalTitle"
                  label="客户号码："
                  name="callees"
                >
                  <a-upload
                    v-model:fileList="formData.callees"
                    name="file"
                    accept=".xls,.xlsx,.txt"
                    @change="addFile"
                    :showUploadList="false"
                  >
                    <a-button type="primary" :loading="visibleState.resolveData"
                      >选择文件</a-button
                    >
                    <span class="hint-span"
                      ><a
                        href="/crm-task/upload-example.zip"
                        download="upload-example.zip"
                        >下载模板</a
                      >
                      只支持.xls,.xlsx,.txt文件</span
                    >
                  </a-upload>
                  <p class="tips-explain" v-if="formData.callees.length > 0">
                    {{ formData.callees.length }}个号码
                  </p>
                </a-form-item>
                <a-form-item label="可呼叫时段：" name="expireTimes">
                  <addTimes
                    :value="formData.expireTimes"
                    @change="changeTimes"
                  ></addTimes>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-divider>线路配置</a-divider>
              <a-col :span="12">
                <a-form-item label="并发模式：" name="concurrentType">
                  <a-radio-group
                    v-model:value="formData.concurrentType"
                    button-style="solid"
                  >
                    <a-radio-button value="0">
                      固定并发
                    </a-radio-button>
                    <a-radio-button value="1">
                      智能并发
                    </a-radio-button>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="配置系数：" name="callers">
                  <a-input v-model:value="formData.configFactor" />
                </a-form-item>
                <a-form-item label="指定秒后挂断的员工数：" name="muchLater">
                  <a-input v-model:value="formData.muchLater" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="最大并发数：" name="maxConcurrent">
                  <a-input v-model:value="formData.maxConcurrent" />
                </a-form-item>
                <a-form-item label="手工系数：" name="manualFactor">
                  <a-input v-model:value="formData.manualFactor" />
                </a-form-item>
                <a-form-item label="播放语音：" name="playVoice">
                  <a-radio-group
                    v-model:value="formData.playVoice"
                    button-style="solid"
                  >
                    <a-radio-button value="0">
                      否
                    </a-radio-button>
                    <a-radio-button value="1">
                      是
                    </a-radio-button>
                  </a-radio-group>
                </a-form-item>
                <a-form-item
                  v-if="formData.playVoice == 1"
                  label="上传语音："
                  name="audioFile"
                >
                  <a-upload
                    :headers="datas.headers"
                    action="http://192.168.0.242:8090/api/config/groupcall/upload/record"
                    name="multipartFile"
                    accept=".mp3,.wav"
                    @change="addAudioFile"
                    :showUploadList="false"
                  >
                    <a-button
                      :loading="visibleState.resolveDataAudio"
                      type="primary"
                      >选择文件</a-button
                    >
                    <span class="hint-span"
                      >只支持.mp3,.wav格式的录音<br />{{
                        formData.audioFile
                      }}</span
                    >
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-modal>
      </div>
      <div class="configListMian-top-right">
        <a-button @click="handleGetTaskList">
          刷新
        </a-button>
      </div>
    </div>
    <div class="configListMian-center">
      <div class="configListMian-center-table">
        <!-- (组件还没写，代码太累赘了，嗐！) -->
        <a-table
          ref="tableElRef"
          :loading="visibleState.loading"
          :columns="columns"
          :data-source="datas.tabelData"
          :scroll="{ x: 1300, y: '' }"
          rowKey="seatsId"
          size="middle"
          :pagination="{
            size: 'small',
            showQuickJumper: true,
            showSizeChanger: true,
            current: datas.current,
            pageSize: datas.pageSize,
            total: datas.total,
            pageSizeOptions: datas.pageSizeOptions
          }"
          @change="changeTaskList"
        >
          <!--status0未启动1已完成2运行中3暂停中-->
          <!--zf:未启动暂停中可以启用运行中可以暂停已完成状态不可以操作-->
          <template v-slot:status="{ record }">
            <a-tooltip>
              <template #title>
                {{
                  record.status === 0
                    ? "未启动, 点击启用"
                    : record.status === 2
                    ? "运行中, 点击启用暂停"
                    : record.status === 3
                    ? "暂停中, 点击启用"
                    : record.status === 1
                    ? "已完成"
                    : ""
                }}
              </template>
              <PlayCircleOutlined
                v-if="record.status === 0"
                :style="{ color: '#ffaa00', cursor: 'pointer' }"
                @click="showModal(record, '启用群呼任务')"
              />
              <PauseCircleOutlined
                v-else-if="record.status === 3"
                :style="{ color: '#000', cursor: 'pointer' }"
                @click="showModal(record, '启用群呼任务')"
              />
              <SyncOutlined
                v-else-if="record.status === 2"
                :style="{ color: '#1890ff', cursor: 'pointer' }"
                @click="showModal(record, '暂停群呼任务')"
              />
              <span v-else-if="record.status === 'b'">待启动</span>
              <span v-else>{{
                record.status === 1 ? "已完成" : "已终止"
              }}</span>
            </a-tooltip>
          </template>
          <template v-slot:playVoice="{ record }">
            <span>{{ record.playVoice === 1 ? "播放" : "" }}</span>
          </template>
          <template v-slot:operation="{ record }">
            <span class="table-operation">
              <samp
                class="operation-edit"
                @click="handleGetCalleeList(record.taskId)"
                >呼叫详情</samp
              >
              <a-divider type="vertical" />
              <samp class="operation-edit" @click="handleModal('edit', record)"
                >编辑</samp
              >
              <a-divider type="vertical" />
              <a-popconfirm
                v-if="datas.tabelData.length"
                :title="
                  '删除任务 “' + record.taskName + '” 不可逆，确定删除改选项吗?'
                "
                cancelText="取消"
                okText="确定"
                @confirm="onDelete(record.taskId)"
              >
                <samp class="operation-del">删除</samp>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-modal
          title="提示信息"
          v-model:visible="visibleState.visibleStatus"
          :confirm-loading="visibleState.confirmLoading"
          @ok="handleOkStatus"
          @cancel="handleCancelStatus"
        >
          <h2>
            <ExclamationCircleOutlined style="color:#ffaa00;" /> 确定{{
              datas.statusTitle
            }}：
            <span class="model-status"
              >{{ " “ " + datas.statusModel.taskName + "  ” " }}
            </span>
            吗？
          </h2>
        </a-modal>
      </div>
      <a-drawer
        title="呼叫详情"
        placement="right"
        :closable="false"
        width="780"
        v-model:visible="visibleState.drawerVisible"
      >
        <a-row>
          <a-col :span="21">
            <span class="searchHead">
              <label>客户号码：</label>
              <a-input-search
                v-model:value="datas.drawerCallee"
                style="width: 200px;"
                placeholder="请输入客户号码"
                enter-button
                :allowClear="true"
                @search="
                  datas.drawerCallee
                    ? handleGetCalleeList(datas.taskIdCallee)
                    : ''
                "
              />
            </span>
            <span class="searchHead">
              <label>呼叫状态：</label>
              <a-select
                v-model:value="datas.drawerResult"
                style="width: 200px"
                placeholder="请选择"
                :dropdownMenuStyle="{
                  'max-height': '140px'
                }"
                :allowClear="true"
                @change="handleGetCalleeList(datas.taskIdCallee)"
              >
                <template v-for="(option, i) in datas.optionStatus" :key="i">
                  <a-select-option :value="option.value" :label="option.label">
                    {{ option.label }}
                  </a-select-option>
                </template>
              </a-select>
            </span>
          </a-col>
          <a-col :span="2">
            <a-button @click="handleGetCalleeList(datas.taskIdCallee)"
              >刷新</a-button
            >
          </a-col>
        </a-row>
        <a-row class="table-callee-class">
          <a-col :span="24">
            <a-table
              ref="tableCallee"
              :loading="visibleState.loadingCallee"
              :columns="columnsCallee"
              :data-source="datas.tabelDataCallee"
              rowKey="callee"
              size="middle"
              :pagination="{
                size: 'small',
                showQuickJumper: true,
                showSizeChanger: true,
                current: datas.currentCallee,
                pageSize: datas.pageSizeCallee,
                total: datas.totalCallee,
                pageSizeOptions: datas.pageSizeOptions
              }"
              @change="changeCalleeList"
            >
            </a-table>
          </a-col>
        </a-row>
      </a-drawer>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  unref,
  toRaw,
  onMounted,
  computed,
  nextTick
} from "vue";
import API from "../../api/api";
import { message } from "ant-design-vue";
import { useForm } from "@ant-design-vue/use";
import {
  PlayCircleOutlined,
  ExclamationCircleOutlined,
  PauseCircleOutlined,
  SyncOutlined
} from "@ant-design/icons-vue";
import XLSX from "xlsx";
import addTimes from "./components/addTimes.vue";

export default defineComponent({
  components: {
    PlayCircleOutlined,
    addTimes,
    ExclamationCircleOutlined,
    PauseCircleOutlined,
    SyncOutlined
  },
  /** 所有的代码逻辑将在setup方法中实现，并且不再有this */
  setup(props, { emit }) {
    /** 返回值 */
    const visibleState: any = reactive({
      loading: false,
      modalVisible: false,
      modalTitle: false,
      drawerVisible: false,
      resolveData: false,
      resolveDataAudio: false,
      loadingCallee: false,
      visibleStatus: false,
      confirmLoading: false
    });
    // 表单数据
    const ruleForm: any = ref<any>(null);
    const formData: any = reactive({
      taskName: "",
      callerGroupId: "",
      seatsId: "",
      callees: [],
      repeatCount: "",
      expireTimes: [],
      concurrentType: "0",
      maxConcurrent: "",
      configFactor: "",
      manualFactor: "",
      muchLater: "",
      playVoice: "0",
      audioFile: ""
    });
    const rules: any = reactive({
      taskName: [
        {
          required: true,
          message: "请填写任务名称"
        }
      ],
      callerGroupId: [
        {
          required: true,
          message: "请选择主叫号码组"
        }
      ],
      seatsId: [
        {
          required: true,
          message: "请选择坐席组"
        }
      ],
      callees: [
        {
          required: true,
          message: "号码数量不能为空"
        }
      ]
    });
    // 数据
    const datas: any = reactive({
      pageSizeOptions: ["30", "50", "100", "200"],
      pageSize: 30,
      current: 1,
      total: 0,
      pageSizeCallee: 30,
      currentCallee: 1,
      totalCallee: 0,
      headers: { token: sessionStorage.token },
      fileList: [],
      seatsData: [],
      tabelData: [], //表格数据
      selectData: [], //表格数据
      optionStatus: [],
      drawerCallee: "",
      drawerResult: "",
      tabelDataCallee: [],
      taskIdCallee: "",
      statusModel: {},
      statusTitle: "",
      checked1: []
    });
    const tableElRef = ref(null);
    //表格数据 (组件还没写，代码太累赘了，嗐！)
    const columns = ref<any>([
      {
        title: "任务名称",
        dataIndex: "taskName",
        key: "taskName",
        align: "center"
      },
      {
        title: "坐席组",
        dataIndex: "seatsName",
        key: "seatsName",
        align: "center"
      },
      {
        title: "主叫号码组",
        dataIndex: "groupName",
        key: "groupName",
        align: "center"
      },
      {
        title: "呼叫轮数",
        dataIndex: "repeatCount",
        key: "repeatCount",
        align: "center"
      },
      {
        title: "并发模式",
        dataIndex: "concurrentType",
        key: "concurrentType",
        align: "center"
      },
      {
        title: "最大并发数",
        dataIndex: "maxConcurrent",
        key: "maxConcurrent",
        align: "center"
      },
      {
        title: "配置系数",
        dataIndex: "configFactor",
        key: "configFactor",
        align: "center"
      },
      {
        title: "手工系数",
        dataIndex: "manualFactor",
        key: "manualFactor",
        align: "center"
      },
      {
        title: "指定秒后挂断的员工数",
        dataIndex: "muchLater",
        key: "muchLater",
        align: "center"
      },
      {
        title: "播放语音",
        dataIndex: "playVoice",
        key: "playVoice",
        slots: { customRender: "playVoice" },
        align: "center"
      },
      {
        title: "语音文件",
        dataIndex: "audioFile",
        key: "audioFile",
        ellipsis: true,
        align: "center"
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        slots: { customRender: "status" },
        align: "center"
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        slots: { customRender: "operation" },
        align: "center",
        width: 180,
        fixed: "right"
      }
    ]);
    const columnsCallee = ref<any>([
      {
        title: "客户号码",
        dataIndex: "callee",
        key: "callee",
        align: "center"
      },
      {
        title: "呼叫状态",
        dataIndex: "result",
        key: "result",
        align: "center"
      }
    ]);
    const { resetFields } = useForm(formData, rules);
    /** 方法 */
    // 获取号码
    async function getWorker() {
      API.configListAPI.callerGroupList().then(response => {
        datas.selectData = (() => {
          const arr: any = [];
          response.data.forEach((e: any) => {
            arr.push({
              label: e.groupName,
              value: e.callerGroupId.toString()
            });
          });
          return arr;
        })();
        return datas.selectData;
      });
    }
    // 获取坐席组
    async function getSeatsGroupList() {
      // 调用接口API seatsId: 1 seatsName: "测试"
      API.configListAPI
        .seatsGroupList()
        .then(response => {
          datas.seatsData = (() => {
            const arr: any = [];
            response.data.forEach((e: any) => {
              arr.push({
                label: e.seatsName,
                value: e.seatsId.toString()
              });
            });
            return arr;
          })();
          return datas.seatsData;
        })
        .catch(e => {
          console.log(e);
        });
    }
    // 获取呼叫状态
    async function getCalleeStatus() {
      API.configListAPI.getCallStatus().then(response => {
        datas.optionStatus = [];
        try {
          const arr = response.data;
          arr.forEach((e: any) => {
            const optionStatus = Object.entries(e)[0];
            datas.optionStatus.push({
              label: optionStatus[0],
              value: optionStatus[1]
            });
          });
        } catch (e) {
          console.log(e);
        }
      });
    }
    // 获取列表
    async function handleGetTaskList() {
      visibleState.loading = true;
      API.configListAPI
        .getTaskList({
          params: {
            sortField: "", //排序字段
            order: "", //排序方式
            page: datas.current,
            pageSize: datas.pageSize
          }
        })
        .then(response => {
          // console.log("res", response)
          visibleState.loading = false;
          datas.tabelData = response.data.list;
          datas.current = response.data.page;
          datas.pageSize = response.data.pageSize;
          datas.total = response.data.total;
        })
        .catch(e => {
          visibleState.loading = false;
          console.log("获取列表错误：", e);
          datas.tabelData = [];
        });
    }
    // 列表分页 --分页、排序、筛选变化时触发(pagination:any, filters:any, sorter:any, { currentDataSource }:any)
    async function changeTaskList(pagination: any) {
      // console.log("pagination:", pagination)
      datas.current = pagination.current;
      datas.pageSize = pagination.pageSize;
      await handleGetTaskList();
    }
    // 获取getCalleeList
    async function handleGetCalleeList(taskId: string | number) {
      visibleState.drawerVisible = true;
      getCalleeStatus();
      visibleState.loadingCallee = true;
      datas.taskIdCallee = taskId;
      API.configListAPI
        .getCalleeList({
          params: {
            taskId: taskId,
            result: datas.drawerResult,
            callee: datas.drawerCallee,
            sortField: "", //排序字段
            order: "", //排序方式
            page: datas.currentCallee,
            pageSize: datas.pageSizeCallee
          }
        })
        .then(response => {
          // console.log("res", response)
          visibleState.loadingCallee = false;
          datas.tabelDataCallee = [];
          response.data.list.forEach((e: object | any) => {
            let statusName = "";
            try {
              datas.optionStatus.forEach((item: any) => {
                if (parseInt(item.value) === parseInt(e.result)) {
                  statusName = item.label;
                  return statusName;
                }
              });
            } catch (e) {
              console.log(e);
              return (statusName = e.result);
            }
            datas.tabelDataCallee.push({
              callee: e.callee,
              result: statusName
            });
          });
          datas.currentCallee = response.data.page;
          datas.pageSizeCallee = response.data.pageSize;
          datas.totalCallee = response.data.total;
        })
        .catch(e => {
          visibleState.loadingCallee = false;
          console.log("获取列表错误：", e);
          datas.tabelDataCallee = [];
        });
    }
    async function changeCalleeList(pagination: any) {
      datas.currentCallee = pagination.currentCallee;
      datas.pageSizeCallee = pagination.pageSizeCallee;
      handleGetCalleeList(datas.taskIdCallee);
    }
    // 表格 状态 操作
    function showModal(record: any, title: string) {
      visibleState.visibleStatus = true;
      console.log("record, $event", record);
      datas.statusModel = record;
      datas.statusTitle = title;
    }
    async function handleOkStatus() {
      visibleState.visibleStatus = false;
      // status0未启动1已完成2运行中3暂停中
      // zf:未启动暂停中可以启用运行中可以暂停已完成状态不可以操作
      // item.status === 'b' || item.status === 2 ? '/api/config/groupcall/start' : '/api/config/groupcall/stop',
      const item = datas.statusModel;
      if (item.status === 0 || item.status === 3) {
        API.configListAPI
          .startStatus({
            taskId: item.taskId
          })
          .then(response => {
            console.log("res", response);
            message.success("已启用");
          })
          .catch(e => {
            console.log("获取列表错误：", e);
          });
      } else if (item.status === 2) {
        API.configListAPI
          .stopStatus({
            taskId: item.taskId
          })
          .then(response => {
            console.log("res", response);
            message.success("已暂停");
          })
          .catch(e => {
            console.log("获取列表错误：", e);
          });
      }
    }
    function handleCancelStatus() {
      visibleState.visibleStatus = false;
      //  handleGetTaskList();
    }

    // 前端解析电话号码文件
    function resetPhone(numberList: any) {
      const numText = new RegExp(/^[0-9]+$/);
      const errList = [];
      const result = [
        ...new Set(
          numberList.filter((item: any) => {
            if (item) {
              if (numText.test(item)) return true;
              else {
                errList.push(item);
                return false;
              }
            } else return false;
          })
        )
      ];
      if (!errList.length) {
        // emit('input', result)
        // emit('change', result)
        // console.log("result", result)
        formData.callees = result;
      } else {
        message.error("号码只能为数字,文件包含有其他字符，请检查", 2);
      }
      nextTick(() => {
        visibleState.resolveData = false;
      });
    }
    function addFile(allFile: any) {
      if (allFile.file.status === "uploading") {
        // 解析电话
        const file = allFile.file;
        const fileList = allFile.fileList;
        if (/\.(xls|xlsx|txt)$/.test(file.name)) {
          const fileReader = new FileReader();
          fileReader.onload = ev => {
            try {
              const target: any = ev.target;
              if (/\.txt$/.test(file.name)) {
                resetPhone(target.result.split(/[\r\n\s，,#"']/));
              } else {
                const workbook = XLSX.read(target.result, {
                  type: "binary"
                });
                const wsname = workbook.SheetNames[0]; // 取第一张表
                const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], {
                  header: "A",
                  raw: true,
                  defval: ""
                });
                resetPhone(ws.map((item: any) => item["A"].toString().trim()));
              }
              setTimeout(() => {
                fileList.pop();
              }, 0);
            } catch (e) {
              visibleState.resolveData = false;
              message.warning("处理文件失败");
              fileList.pop();
            }
          };
          nextTick(() => {
            if (/\.txt$/.test(file.name))
              fileReader.readAsText(file.originFileObj, "utf-8");
            else fileReader.readAsBinaryString(file.originFileObj);
          });
        } else {
          visibleState.resolveData = false;
          message.warning("文件格式不支持");
          fileList.pop();
        }
        return false;
      }
      if (allFile.file.status === "done") {
        // Get this url from response in real world.
        return false;
      }
      if (allFile.file.status === "error") {
        return false;
      }
    }

    // 上传录音文件
    async function addAudioFile(allFile: any) {
      visibleState.resolveDataAudio = true;
      if (allFile.file.status === "done") {
        // message.success(`${allFile.file.name} file uploaded successfully`);
        const file = allFile.file;
        if (file.response && file.response.msg) {
          formData.audioFile = file.response.msg;
          nextTick(() => {
            visibleState.resolveDataAudio = false;
          });
        } else {
          message.error(`${allFile.file.name} 文件上传失败！`);
          formData.audioFile = "";
          nextTick(() => {
            visibleState.resolveDataAudio = false;
          });
        }
      } else if (allFile.file.status === "error") {
        message.error(`${allFile.file.name} 文件上传失败！`);
        nextTick(() => {
          visibleState.resolveDataAudio = false;
        });
      }
    }
    // 获取该行的编辑数据详情
    async function handelDetailTask(taskId: string | number) {
      API.configListAPI
        .detailTask({
          taskId: taskId
        })
        .then(response => {
          // console.log("res", response)
          const callTask = response.data.callTask;
          formData.taskName = callTask.taskName;
          formData.callerGroupId = callTask.callerGroupId.toString();
          formData.seatsId = callTask.seatsId.toString();
          formData.repeatCount = callTask.repeatCount;
          formData.concurrentType = callTask.concurrentType.toString();
          formData.maxConcurrent = callTask.maxConcurrent;
          formData.configFactor = callTask.configFactor;
          formData.manualFactor = callTask.manualFactor;
          formData.muchLater = callTask.muchLater;
          formData.playVoice = callTask.playVoice.toString();
          formData.audioFile = callTask.audioFile;
          // formData.callees = []
          const expireTimes: any = [];
          response.data.expireTimes.map((item: any) => {
            expireTimes.push({
              endTime:
                item.endTime.length > 5
                  ? item.endTime.slice(0, -3)
                  : item.endTime,
              startTime:
                item.startTime.length > 5
                  ? item.startTime.slice(0, -3)
                  : item.startTime,
              week: item.week.split(",").map((item: string) => Number(item))
            });
          });
          formData.expireTimes = expireTimes;
          formData.taskId = taskId;
        })
        .catch(e => {
          console.log(e);
        });
    }
    // 打开新增、编辑的模态框
    function handleModal(key: string, data: any) {
      resetFields(); // 重置表单
      getWorker();
      getSeatsGroupList();
      visibleState.modalVisible = true;
      if (key == "add") {
        visibleState.modalVisible = true;
        visibleState.modalTitle = true;
      } else if (key == "edit") {
        visibleState.modalVisible = true;
        visibleState.modalTitle = false;
        handelDetailTask(data.taskId);
      }
    }
    // 新增，修改方法
    async function handleAddUpdate() {
      // console.log("form", formData)
      const form = unref(ruleForm);
      if (!form) return;
      if (visibleState.modalTitle) {
        try {
          const data = await form.validate();
          API.configListAPI
            .addTask(
              toRaw({
                taskName: data.taskName,
                seatsId: data.seatsId,
                callerGroupId: data.callerGroupId,
                callees: `[${data.callees.map((item: any) => {
                  return JSON.stringify(item);
                })}]`,
                repeatCount: data.repeatCount,
                expireTimes:
                  data.expireTimes.length > 0
                    ? `[${data.expireTimes.map((item: any) => {
                        return JSON.stringify({
                          endTime: item.endTime,
                          startTime: item.startTime,
                          week: item.week.join(",")
                        });
                      })}]`
                    : "[]",
                concurrentType: data.concurrentType,
                maxConcurrent: data.maxConcurrent,
                configFactor: data.configFactor,
                manualFactor: data.manualFactor,
                muchLater: data.muchLater,
                playVoice: data.playVoice,
                audioFile: data.audioFile
              })
            )
            .then(() => {
              visibleState.modalVisible = false;
              message.success("添加成功!");
              handleGetTaskList();
            })
            .catch(e => {
              console.log("task list添加失败:  ", e);
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        // update
        try {
          const taskId = formData.taskId;
          const updataData = await form.validate();
          // console.log("updataData", updataData);
          API.configListAPI
            .updateTask(
              toRaw({
                taskId: taskId,
                taskName: updataData.taskName,
                seatsId: updataData.seatsId,
                callerGroupId: updataData.callerGroupId,
                repeatCount: updataData.repeatCount,
                expireTimes:
                  updataData.expireTimes.length > 0
                    ? `[${updataData.expireTimes.map((item: any) => {
                        return JSON.stringify({
                          endTime: item.endTime,
                          startTime: item.startTime,
                          week: item.week.join(",")
                        });
                      })}]`
                    : "[]",
                concurrentType: updataData.concurrentType,
                maxConcurrent: updataData.maxConcurrent,
                configFactor: updataData.configFactor,
                manualFactor: updataData.manualFactor,
                muchLater: updataData.muchLater,
                playVoice: updataData.playVoice,
                audioFile: updataData.audioFile
              })
            )
            .then(() => {
              visibleState.modalVisible = false;
              message.success("更新成功!");
              handleGetTaskList();
            })
            .catch(e => {
              console.log("update失败:  ", e);
            });
        } catch (error) {
          console.log("update失败", error);
        }
      }
    }
    // 删除
    async function onDelete(key: any) {
      API.configListAPI
        .deleteTask({
          taskId: key
        })
        .then(res => {
          message.success("删除成功!");
          handleGetTaskList();
        })
        .catch(e => {
          console.log("deleteTask", e);
        });
    }
    // 获取时间段
    function changeTimes(value: any) {
      formData.expireTimes = value;
    }
    // 生命周期
    onMounted(() => {
      // 调用当前方法
      handleGetTaskList();
    });
    // 计算属性
    computed(() => {
      // handleTableTreeData;
    });
    /** 返回值  */
    return {
      tableElRef,
      visibleState,
      ruleForm,
      formData,
      rules,
      columns,
      columnsCallee,
      datas,
      handleModal,
      handleGetTaskList,
      changeTaskList,
      handleAddUpdate,
      onDelete,
      showModal,
      handleOkStatus,
      handleCancelStatus,
      getWorker,
      getSeatsGroupList,
      addFile,
      addAudioFile,
      changeTimes,
      handleGetCalleeList,
      getCalleeStatus,
      changeCalleeList
    };
  }
});
</script>
<style lang="stylus" scoped>
.ant-table td { white-space: nowrap; }
.configListMian {
  padding: 20px;
  &-top {
    padding-bottom: 10px;

    &-left {
      display: inline-block;
    }

    &-right {
      display: inline-block;
      position: absolute;
      right: 20px;
    }
  }

  &-center {
    padding-top: 10px;
  }

  .operation-edit {
    color: #409EFF;
    cursor: pointer;
  }

  .operation-del {
    color: red;
    cursor: pointer;
  }
}
.hint-span{
  color: black;
  font-size: 12px;
  margin-left: 4px;
  a{
    color: #1890ff;
  }
}
.tips-explain{
  position: absolute;
  padding: 0;
  margin-top: -12px;
  margin-bottom: 0px;
  color: #ffbc00;
  font-size: 12px;
}
.searchHead{
  padding-right: 8px;
  label{
    // vertical-align: -webkit-baseline-middle;
  }
}
.table-callee-class{
  margin-top: 22px;
}
.model-status{
  color: #ffaa00;
}
</style>
<style>
.ant-modal-wrap {
  z-index: 1001;
}
.ant-form-item-label {
  white-space: initial;
}
</style>
