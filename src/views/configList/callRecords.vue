<template>
  <div class="configListMian">
    <div class="configListMian-top">
      <!-- <div class="configListMian-search-head">
        <a-row>
          <a-col :span="22">
            <span class="searchHead">
              <label>客户号码：</label>
              <a-input
                v-model:value="datas.onlyphone"
                placeholder="请输入客户号码"
                style="width: 200px"
              />
            </span>
            <span class="searchHead">
              <label>选择时间：</label>
              <a-range-picker
                v-model:value="datas.DateTime"
                format="YYYY-MM-DD HH:mm:ss"
                showTime
                :placeholder="['拨打开始时间', '拨打结束时间']"
                @ok="onPick"
              />
            </span>
            <span class="searchHead">
              <label>呼叫任务：</label>
              <a-select
                v-model:value="datas.taskId"
                style="width: 200px"
                placeholder="请选择所属呼叫任务"
                :dropdownMenuStyle="{
                  'max-height': '140px'
                }"
                :allowClear="true"
                @change="handleGetCalleeList(datas.taskIdCallee)"
              >
                <template v-for="(option, i) in datas.taskData" :key="i">
                  <a-select-option :value="option.value" :label="option.label">
                    {{ option.label }}
                  </a-select-option>
                </template>
              </a-select>
            </span>
            <span class="searchHead">
              <label>坐席：</label>
              <a-select
                v-model:value="datas.workerId"
                style="width: 200px"
                placeholder="请选择坐席"
                :dropdownMenuStyle="{
                  'max-height': '140px'
                }"
                :allowClear="true"
                @focus="getSeatsGroupList"
                @change="handleGetCalleeList(datas.taskIdCallee)"
              >
                <template v-for="(option, i) in datas.seatsData" :key="i">
                  <a-select-option :value="option.value" :label="option.label">
                    {{ option.label }}
                  </a-select-option>
                </template>
              </a-select>
            </span>
            <span class="searchHead">
              <label>接通状态：</label>
              <a-select
                v-model:value="datas.status"
                style="width: 200px"
                placeholder="请选择接通状态"
                :dropdownMenuStyle="{
                  'max-height': '140px'
                }"
                :allowClear="true"
                @focus="getOnStatus"
                @change="handleGetCalleeList(datas.taskIdCallee)"
              >
                <template v-for="(option, i) in datas.onstatusData" :key="i">
                  <a-select-option :value="option.value" :label="option.label">
                    {{ option.label }}
                  </a-select-option>
                </template>
              </a-select>
            </span>
          </a-col>
          <a-col :span="1">
            <a-button type="primary" @click="handleGetRecordList"
              >查询</a-button
            >
          </a-col>
        </a-row>
      </div> -->
    </div>
    <div class="configListMian-center">
      <div class="configListMian-center-table">
        <!-- <a-table
          ref="tableElRef"
          :loading="visibleState.loading"
          :columns="columns"
          :data-source="datas.tabelData"
          :scroll="{ x: 1300, y: '' }"
          rowKey="uuid"
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
          <template v-slot:operation="{ record }">
            <span class="table-operation">
              <samp class="operation-edit" @click="download(record.uuid)"
                >下载录音</samp
              >
              <a-divider type="vertical" />
              <a-tooltip>
                <template #title>
                  播放录音
                </template>
                <PlayCircleOutlined
                  :style="{ color: '#1890ff', cursor: 'pointer' }"
                  @click="listenAudio(record, $event)"
                />
              </a-tooltip>
              <audio src="" controls="controls"></audio>
            </span>
          </template>
        </a-table> -->
        <div>
          <!-- {{ formData }} -->
          <PBasicForm v-model:dataSource="formData"></PBasicForm>
        </div>
        <a-modal
          title="提示信息"
          v-model:visible="visibleState.visibleStatus"
          :confirm-loading="visibleState.confirmLoading"
        >
          <!--  @ok="handleOkStatus"
          @cancel="handleCancelStatus" -->
          <h2>
            提示信息
          </h2>
        </a-modal>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  shallowReactive,
  reactive,
  ref,
  onMounted,
  provide
} from "vue";
import API from "../../api/api";
import { message } from "ant-design-vue";
import { PlayCircleOutlined } from "@ant-design/icons-vue";
import moment from "moment";
import { parseTime, average } from "../../utils/index";
import PBasicForm from "@/components/form/BasicForm.vue";

export default defineComponent({
  // eslint-disable-next-line vue/no-unused-components
  components: { PlayCircleOutlined, PBasicForm },
  /** 所有的代码逻辑将在setup方法中实现，并且不再有this */
  setup() {
    const formData: any = reactive([
      {
        type: "text", // 控件类型
        labelText: "text控件名称", // 控件显示的文本
        fieldName: "formField1",
        value: "test",
        placeholder: "文本输入区域", // 默认控件的空值文本
        rules: [
          {
            required: true,
            message: "必填"
          }
        ]
      },
      {
        labelText: "数字输入框",
        type: "number",
        fieldName: "formField2",
        value: "",
        placeholder: "这只是一个数字的文本输入框"
      },
      {
        labelText: "单选框",
        type: "radio",
        fieldName: "formField3",
        value: "",
        defaultValue: "0",
        options: [
          {
            label: "选项1",
            value: "0"
          },
          {
            label: "选项2",
            value: "1"
          }
        ]
      },
      {
        labelText: "日期选择",
        type: "datetime",
        fieldName: "formField4",
        value: "",
        placeholder: "选择日期"
      },
      {
        labelText: "日期范围",
        type: "datetimeRange",
        fieldName: "formField5",
        value: [],
        placeholder: ["开始日期", "选择日期"]
      },
      {
        labelText: "文本区域",
        type: "textarea",
        fieldName: "formField6",
        value: "",
        placeholder: "请输入文本了内容"
      },
      {
        type: "multiple",
        labelText: "角色",
        fieldName: "role",
        value: ["0", "1"],
        // multiple: "multiple",
        defaultValue: [],
        rules: [
          {
            required: true,
            message: "必须选择一种角色"
          }
        ],
        options: [
          {
            label: "系统管理员",
            value: "0"
          },
          {
            label: "风控管理员",
            value: "1"
          },
          {
            label: "催收管理员",
            value: "2"
          },
          {
            label: "催收员",
            value: "3"
          },
          {
            label: "审核员",
            value: "4"
          },
          {
            label: "财务",
            value: "5"
          }
        ]
      },
      {
        labelText: "下拉框",
        type: "select",
        fieldName: "formField7",
        value: "",
        placeholder: "下拉选择你要的",
        options: [
          {
            label: "text1",
            value: "0"
          },
          {
            label: "text2",
            value: "1"
          }
        ]
      },
      {
        labelText: "联动",
        type: "cascader",
        fieldName: "formField8",
        value: [],
        placeholder: "级联选择",
        options: [
          {
            value: "zhejiang",
            label: "Zhejiang",
            children: [
              {
                value: "hangzhou",
                label: "Hangzhou",
                children: [
                  {
                    value: "xihu",
                    label: "West Lake"
                  },
                  {
                    value: "xiasha",
                    label: "Xia Sha",
                    disabled: true
                  }
                ]
              }
            ]
          },
          {
            value: "jiangsu",
            label: "Jiangsu",
            children: [
              {
                value: "nanjing",
                label: "Nanjing",
                children: [
                  {
                    value: "zhonghuamen",
                    label: "Zhong Hua men"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]);
    /** 返回值 */
    const visibleState: any = reactive({
      loading: false,
      visibleStatus: false
    });
    // 数据
    const datas: any = shallowReactive({
      pageSizeOptions: ["30", "50", "100", "200"],
      pageSize: 30,
      current: 1,
      total: 0,
      tabelData: [], //表格数据
      onlyphone: "",
      DateTime: [
        parseTime(new Date(), "{y}-{m}-{d} 00:00:00"),
        parseTime(new Date(), "{y}-{m}-{d} 23:59:59")
      ],
      taskId: "", //任务
      taskData: [], //任务下拉值
      workerId: "", //坐席值
      seatsData: [], //坐席下拉值
      status: "", //接通转态
      onstatusData: [] //接通下拉值
    });
    const tableElRef = ref(null);
    //表格数据 (组件还没写，代码太累赘了，嗐！)
    const columns = ref<any>([
      {
        title: "客户号码",
        dataIndex: "onlyphone",
        align: "center",
        width: 120,
        fixed: "left"
      },
      {
        title: "原始线路号码",
        width: 110,
        dataIndex: "orinumber",
        align: "center"
      },
      {
        title: "坐席名称",
        width: 100,
        dataIndex: "workerName",
        align: "center"
      },
      {
        title: "坐席分机号",
        width: 110,
        dataIndex: "extnumber",
        align: "center"
      },
      {
        title: "开始时间",
        width: 100,
        dataIndex: "startTime",
        align: "center"
      },
      {
        title: "坐席挂机时间",
        width: 110,
        dataIndex: "wHangupTime",
        align: "center"
      },
      {
        title: "坐席通话时长（秒）",
        width: 120,
        dataIndex: "wDuration",
        align: "center"
      },
      {
        title: "客户接听时间",
        width: 110,
        dataIndex: "cAnswerTime",
        align: "center"
      },
      {
        title: "客户挂机时间",
        width: 110,
        dataIndex: "cHangupTime",
        align: "center"
      },
      {
        title: "客户通话时长（秒）",
        width: 120,
        dataIndex: "cDuration",
        align: "center"
      },
      {
        title: "通话描述",
        dataIndex: "callstatustext",
        width: 100,
        ellipsis: true,
        align: "center"
      },
      {
        title: "所属群呼任务",
        width: 110,
        dataIndex: "taskName",
        align: "center"
      },
      {
        title: "所属线路",
        width: 100,
        dataIndex: "gateway",
        align: "center"
      },
      {
        title: "操作",
        dataIndex: "operation",
        slots: { customRender: "operation" },
        align: "center",
        width: 160,
        fixed: "right"
      }
    ]);
    /** 方法 */
    // 获取坐席组
    async function getSeatsGroupList() {
      // 调用接口API seatsId: 1 seatsName: "测试"
      API.configListAPI
        .getWorker()
        .then(response => {
          datas.seatsData = (() => {
            const arr: any = [];
            response.data.forEach((e: any) => {
              arr.push({
                label: e.workerName,
                value: e.workerId.toString()
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
    // 获取接通状态
    async function getOnStatus() {
      API.configListAPI.getOnStatus().then(response => {
        datas.onstatusData = [];
        try {
          const arr = Object.entries(response.data);
          arr.forEach(e => {
            datas.onstatusData.push({
              label: e[0],
              value: e[1]
            });
          });
        } catch (e) {
          console.log(e);
        }
      });
    }
    // 获取列表
    async function handleGetRecordList() {
      visibleState.loading = true;
      API.configListAPI
        .getRecordList({
          params: {
            startTime: datas.DateTime ? datas.DateTime[0] : "",
            endTime: datas.DateTime ? datas.DateTime[1] : "",
            // 'onlyphone': datas.onlyphone,
            // 'workerId': datas.workerId,
            // 'taskId': datas.taskId,
            // 'status': datas.status,
            sortField: "", //排序字段
            order: "", //排序方式
            page: datas.current,
            pageSize: datas.pageSize
          }
        })
        .then((response: any) => {
          // console.log("res", response)
          visibleState.loading = false;
          datas.tabelData = response.data.list;
          // datas.tabelData = [
          //   {
          //     uuid: 1,
          //     onlyphone:'12345678985'
          //   }
          // ]
          datas.current = response.data.page;
          datas.pageSize = response.data.pageSize;
          datas.total = response.data.total;
        })
        .catch((e: any) => {
          visibleState.loading = false;
          console.log("获取列表错误：", e);
          datas.tabelData = [];
        });
    }
    // 列表分页 --分页、排序、筛选变化时触发(pagination:any, filters:any, sorter:any, { currentDataSource }:any)
    async function changeTaskList(pagination: any) {
      datas.current = pagination.current;
      datas.pageSize = pagination.pageSize;
      await handleGetRecordList();
    }
    // 时间选择
    function onPick(value: any) {
      datas.DateTime = [
        parseTime(value[0]._d, "{y}-{m}-{d}"),
        parseTime(value[1]._d),
        "{y}-{m}-{d}"
      ];
    }
    // 下载
    function download(uuid: object | number) {
      API.configListAPI
        .download({
          uuId: uuid
        })
        .then((res: any) => {
          if (res.type && res.type.includes("audio")) {
            // 将lob对象转换为域名结合式的url
            const blobUrl = window.URL.createObjectURL(res);
            const link = document.createElement("a");
            document.body.appendChild(link);
            link.style.display = "none";
            link.href = blobUrl;
            // 设置a标签的下载属性，设置文件名及格式
            link.download = `${
              res["Content-Disposition"]
                ? res["Content-Disposition"].split("=")[1]
                : "录音文件.mp3"
            }`;
            // 自触发click事件
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            // saveAs(res, `${res['Content-Disposition'] ? res['Content-Disposition'].split('=')[1] : '录音文件.mp3'}`)
          } else {
            message.warning("下载失败");
          }
        });
    }
    // 播放录音
    function listenAudio(rowData: object, event: any) {
      console.log("rowData: ", rowData);
      console.log("event: ", event);
    }
    // 生命周期
    onMounted(() => {
      // 调用当前方法
      // handleGetRecordList();
      console.log("...: ", average(6, 7, 8, 9));
      console.log("...2: ", average(...[6, 7, 8]));
    });
    /** 返回值  */
    return {
      formData,
      moment,
      tableElRef,
      visibleState,
      columns,
      datas,
      handleGetRecordList,
      changeTaskList,
      getSeatsGroupList,
      getOnStatus,
      onPick,
      download,
      listenAudio
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
