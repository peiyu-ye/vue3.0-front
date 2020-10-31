<template>
  <div class="configListMian">
    <div class="configListMian-top">
      <div class="configListMian-top-left">
        <a-button type="primary" @click="handleSeatsModal('add')">
          新增
        </a-button>
        <a-modal
          :visible="formState.modalVisible"
          :title="formState.modalTitle ? '新增' : '修改'"
          cancelText="取消"
          okText="确定"
          @cancel="formState.modalVisible = false"
          @ok="handleSeatsGroupAddUpdate"
        >
          <a-form
            ref="ruleForm"
            :model="formData"
            :rules="rules"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item ref="seatsName" label="坐席组名称：" name="seatsName">
              <a-input v-model:value="formData.seatsName" />
            </a-form-item>
            <a-form-item ref="workerIds" label="坐席：" name="workerIds">
              <a-select
                mode="multiple"
                v-model:value="formData.workerIds"
                style="width: 100%"
                placeholder="请选择"
                option-label-prop="label"
                :maxTagCount="1"
                @focus="getWorker"
                :dropdownMenuStyle="{
                  'max-height': '140px'
                }"
              >
                <template v-for="(data, i) in datas.selectData" :key="i">
                  <a-select-option
                    :value="data.workerId"
                    :label="data.workerName"
                  >
                    {{ data.workerName }}
                  </a-select-option>
                </template>
              </a-select>
            </a-form-item>
            <a-form-item ref="remark" label="备注：" name="remark">
              <a-input v-model:value="formData.remark" />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
      <div class="configListMian-top-right">
        <a-button @click="handleUpdate">
          刷新
        </a-button>
      </div>
    </div>
    <div class="configListMian-center">
      <div class="configListMian-center-table">
        <a-table
          :loading="formState.loading"
          :columns="columns"
          :data-source="datas.tabelData"
          size="middle"
          show-size-changer
          :pagination="{
            hideOnSinglePage: true,
            current: current,
            pageSize: pageSize,
            total: total
          }"
        >
          <template v-slot:operation="{ record }">
            <span class="table-operation">
              <samp
                class="operation-edit"
                @click="handleSeatsModal('edit', record)"
                >编辑</samp
              >
              <a-divider type="vertical" />
              <a-popconfirm
                v-if="datas.tabelData.length"
                title="删除不可逆，确定删除改选项吗?"
                cancelText="取消"
                okText="确定"
                @confirm="onDelete(record.seatsId)"
              >
                <samp class="operation-del">删除</samp>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, unref, onMounted } from "vue";
import API from "../../api/api";
import { message } from "ant-design-vue";
import { useForm } from "@ant-design-vue/use";

export default defineComponent({
  /** 所有的代码逻辑将在setup方法中实现，并且不再有this */
  setup() {
    /** 返回值 */
    const formState: any = reactive({
      loading: false,
      modalVisible: false,
      pModalFormVisible: false,
      modalTitle: false
    });
    // 表单数据
    const ruleForm: any = ref<any>(null);
    const formData: any = reactive({
      seatsId: "",
      workerIds: [], //坐席
      seatsName: "", //坐席组名称：
      remark: "" //备注
    });

    // 数据
    const datas: any = reactive({
      selectData: [],
      tabelData: [] //表格数据
    });
    const rules: any = reactive({
      seatsName: [
        {
          required: true,
          message: "请输入坐席组名称",
          trigger: "blur"
        }
      ],
      workerIds: [
        {
          required: true,
          message: "请选择坐席"
        }
      ]
    });
    //表格数据
    const pageSize = ref<number>(15);
    const current = ref<number>(1);
    const total = ref<number>(3);
    const columns = ref<any>([
      {
        title: "坐席组名称",
        dataIndex: "seatsName",
        key: "seatsName",
        align: "center"
      },
      {
        title: "坐席",
        dataIndex: "workerAccount",
        key: "workerAccount",
        align: "center",
        ellipsis: true
      },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
        align: "center",
        ellipsis: true
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        slots: { customRender: "operation" },
        align: "center"
      }
    ]);
    const { resetFields } = useForm(formData, rules);
    /** 方法 */
    async function getWorker() {
      // 调用接口API 获取号码池
      API.configListAPI.getWorker().then(response => {
        datas.selectData = (() => {
          const arr: any = [];
          response.data.forEach((e: any) => {
            arr.push({
              workerName: e.workerName,
              workerId: e.workerId.toString(),
              key: e.id
            });
          });
          return arr;
        })();
        return datas.selectData;
      });
    }

    async function handleSeatsGroupList() {
      formState.loading = true;
      try {
        // 调用接口API
        API.configListAPI
          .seatsGroupList()
          .then(response => {
            datas.tabelData = (() => {
              try {
                const tabelData: any = [];
                response.data.forEach((e: any) => {
                  const workerIds = e.workerIds.split(","); //转换为数组
                  const workerName: any = [];
                  workerIds.map((item: any) => {
                    datas.selectData.map((sel: any) => {
                      if (item == sel.workerId) {
                        return workerName.push(sel.workerName);
                      }
                    });
                  });
                  tabelData.push({
                    companyId: e.companyId,
                    createTime: e.createTime,
                    remark: e.remark,
                    seatsId: e.seatsId,
                    seatsName: e.seatsName,
                    workerIds: e.workerIds,
                    workerAccount: workerName.join(","),
                    key: e.seatsId
                  });
                });
                return tabelData;
              } catch (error) {
                console.log("无数据：", error);
                return [];
              }
            })();
            message.success("获取列表数据成功");
          })
          .catch(e => {
            console.log(e);
          });
      } catch (error) {
        console.log(error);
      } finally {
        formState.loading = false;
      }
    }

    async function handleSeatsGroupAddUpdate() {
      const form = unref(ruleForm);
      if (!form) return;
      if (formState.modalTitle) {
        try {
          const data = await form.validate();
          API.configListAPI
            .seatsGroupAdd({
              workerIds: data.workerIds, // 多个使用英文,隔开 8888,10002
              seatsName: data.seatsName, //名称
              remark: data.remark //备注
            })
            .then(() => {
              formState.modalVisible = false;
              message.success("添加成功!");
              handleSeatsGroupList();
            })
            .catch(e => {
              console.log("catch,Seats-add:  ", e);
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        // update
        try {
          const dataEdit = await form.validate();
          // console.log("dataEdit: ", dataEdit);
          API.configListAPI
            .seatsGroupUpdate({
              seatsId: formData.seatsId,
              workerIds: dataEdit.workerIds, // 多个使用英文,隔开 8888,10002
              seatsName: dataEdit.seatsName, //名称
              remark: dataEdit.remark //备注
            })
            .then(() => {
              formState.modalVisible = false;
              message.success("修改成功!");
              handleSeatsGroupList();
            })
            .catch(e => {
              console.log("catch-seatsGroupUpdate: ", e);
            });
        } catch (error) {
          console.log(error);
        }
      }
    }

    function handleSeatsModal(key: string, data: any) {
      resetFields(); // 重置表单
      if (key == "add") {
        formState.modalVisible = true;
        formState.modalTitle = true;
      } else if (key == "edit") {
        formState.modalVisible = true;
        formState.modalTitle = false;
        formData.seatsId = data.seatsId;
        formData.workerIds = data.workerIds.split(","); //坐席
        formData.seatsName = data.seatsName; //坐席组名称：
        formData.remark = data.remark; //备注
      }
    }

    async function handleSeatsGroupDelete(key: any) {
      API.configListAPI
        .seatsGroupDelete({
          seatsId: key
        })
        .then(res => {
          // console.log(res);
          message.success("删除成功!");
          handleSeatsGroupList();
        })
        .catch(e => {
          console.log("callerGroupAdd", e);
        });
    }

    function handleUpdate(){
      getWorker();
      setTimeout(() => {
        handleSeatsGroupList();
      }, 100);
    }
    // 生命周期
    onMounted(() => {
      // 调用当前方法
      getWorker();
      setTimeout(() => {
        handleSeatsGroupList();
      }, 100);
    });
    /** 返回值  */
    return {
      formState,
      ruleForm,
      formData,
      rules,
      columns,
      datas,
      pageSize,
      current,
      total,
      handleSeatsModal,
      handleSeatsGroupAddUpdate,
      getWorker,
      onDelete: handleSeatsGroupDelete,
      handleUpdate
    };
  }
});
</script>
<style lang="stylus" scoped>
.configListMian {
  &-top {
    padding-bottom: 10px;

    &-left {
      display: inline-block;
    }

    &-right {
      display: inline-block;
      position: absolute;
      right: 0px;
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
</style>
