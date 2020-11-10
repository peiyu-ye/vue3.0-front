<template>
  <div class="configListMian">
    <div class="configListMian-top">
      <div class="configListMian-top-left">
        <a-button type="primary" @click="handleCallerModal('add')">
          新增
        </a-button>
        <a-modal
          :visible="formState.modalVisible"
          :title="formState.modalTitle ? '新增号码组' : '修改号码组'"
          cancelText="取消"
          okText="确定"
          @cancel="formState.modalVisible = false"
          @ok="handleCallerGroupAddUpdate"
        >
          <a-form
            ref="ruleForm"
            :model="formData"
            :rules="rules"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item ref="groupName" label="号码组名称：" name="groupName">
              <a-input v-model:value="formData.groupName" />
            </a-form-item>
            <a-form-item ref="callers" label="号码：" name="callers">
              <a-tree-select
                style="width: 100%"
                v-model:value="formData.callers"
                :tree-data="datas.treeData"
                :maxTagCount="1"
                tree-checkable
                search-placeholder="请选择"
                :dropdownStyle="{
                  'max-height': '140px'
                }"
              />
            </a-form-item>
            <a-form-item ref="remark" label="备注：" name="remark">
              <a-input v-model:value="formData.remark" />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
      <div class="configListMian-top-right">
        <a-button @click="handleCallerGroupList">
          刷新
        </a-button>
      </div>
      <p><Icon icon="mdi:account" color="#000" /></p>
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
                @click="handleCallerModal('edit', record)"
                >编辑</samp
              >
              <a-divider type="vertical" />
              <a-popconfirm
                v-if="datas.tabelData.length"
                title="删除不可逆，确定删除改选项吗?"
                cancelText="取消"
                okText="确定"
                @confirm="onDelete(record.key)"
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
import {
  defineComponent,
  reactive,
  ref,
  unref,
  onMounted,
  computed
} from "vue";
import API from "../../api/api";
import { message } from "ant-design-vue";
import { useForm } from "@ant-design-vue/use";
import Icon from "@/components/Icon/index";

export default defineComponent({
  components: { Icon },
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
      callers: [], //主叫号码,caller:主叫号码,trunkId:主叫号码所属线路ID["1,36"], "caller:1,trunkId:36"
      groupName: "", //分组名称
      remark: "", //备注
      callerGroupId: ""
    });

    // 数据
    const datas: any = reactive({
      treeData: [
        {
          title: "Node1",
          value: "0-0",
          key: "0-0",
          children: [
            {
              title: "Child Node1",
              value: "0-0-0",
              key: "0-0-0"
            }
          ]
        }
      ],
      tabelData: [
        {
          id: "",
          key: "3",
          groupName: "Joe Black",
          callers: "Joe Black",
          remark: 32
        }
      ] //表格数据
    });
    const rules: any = reactive({
      groupName: [
        {
          required: true,
          message: "请输入号码组名称",
          trigger: "blur"
        }
      ],
      callers: [
        {
          required: true,
          message: "请选择号码"
        }
      ]
    });
    //表格数据
    const pageSize = ref<number>(15);
    const current = ref<number>(1);
    const total = ref<number>(3);
    const columns = ref<any>([
      {
        title: "号码组名称",
        dataIndex: "groupName",
        key: "groupName",
        align: "center"
      },
      {
        title: "号码",
        dataIndex: "callers",
        key: "callers",
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
    async function handleCallerGroupList() {
      formState.loading = true;
      try {
        // 调用接口API
        API.configListAPI
          .callerGroupList()
          .then(response => {
            // console.log("response: ", response.data);
            datas.tabelData = (() => {
              try {
                const tabelData: any = [];
                response.data.forEach((e: any) => {
                  let childrens: any = "";
                  const id: any = [];
                  try {
                    e.callerInfoList.forEach((cs: any, index: number) => {
                      childrens +=
                        cs.caller +
                        " (" +
                        cs.trunkName +
                        ")" +
                        (e.callerInfoList.length - 1 == index ? "" : ", ");
                      id.push(cs.trunkId);
                    });
                  } catch (error) {}
                  tabelData.push({
                    id: id,
                    key: e.callerGroupId,
                    groupName: e.groupName,
                    callers: childrens,
                    remark: e.remark
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

    async function handleTableTreeData() {
      // 调用接口API 获取号码池
      API.configListAPI.getTrunknumber().then(response => {
        datas.treeData = (() => {
          const arr: any = [];
          response.data.forEach((e: any) => {
            const childrenNumbers: any[] = [];
            e.trunknumbers.forEach((cs: any) => {
              childrenNumbers.push({
                title: cs.disnumber,
                value: cs.disnumber + "," + e.trunkid,
                key: cs.disnumber + "," + e.trunkid
              });
            });
            arr.push({
              title: e.trunkname + "(" + childrenNumbers.length + "个号码)",
              value: e.trunkid,
              key: e.trunkid,
              children: childrenNumbers
            });
          });
          return arr;
        })();
        return datas.treeData;
      });
    }

    async function handleCallerGroupAddUpdate() {
      const form = unref(ruleForm);
      if (!form) return;
      if (formState.modalTitle) {
        try {
          const data = await form.validate();
          const arr: any = data.callers.map((item: string) => {
            return {
              trunkId: item.split(",")[1],
              caller: item.split(",")[0]
            };
          });
          console.log("add -arr: ", arr);
          API.configListAPI
            .callerGroupAdd({
              callers: `[${arr
                .map((item: any) =>
                  JSON.stringify({ trunkId: item.trunkId, caller: item.caller })
                )
                .join()}]`, //主叫号码,caller:主叫号码,trunkId:主叫号码所属线路ID
              groupName: data.groupName, //分组名称
              remark: data.remark //备注
            })
            .then(() => {
              formState.modalVisible = false;
              message.success("添加成功!");
              handleCallerGroupList();
            })
            .catch(e => {
              console.log("catch,callerGroupAdd", e);
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const dataEdit = await form.validate();
          const arrEdit: any = dataEdit.callers.map((item: string) => {
            return {
              trunkId: item.split(",")[1],
              caller: item.split(",")[0]
            };
          });
          // console.log("add -arrEdit: ", arrEdit);
          API.configListAPI
            .updateCallerGroup({
              callerGroupId: formData.callerGroupId,
              callers: `[${arrEdit
                .map((item: any) =>
                  JSON.stringify({ trunkId: item.trunkId, caller: item.caller })
                )
                .join()}]`, //主叫号码,caller:主叫号码,trunkId:主叫号码所属线路ID
              groupName: dataEdit.groupName, //分组名称
              remark: dataEdit.remark //备注
            })
            .then(() => {
              formState.modalVisible = false;
              message.success("修改成功!");
              handleCallerGroupList();
            })
            .catch(e => {
              console.log("catch-Edit: ", e);
            });
        } catch (error) {
          console.log(error);
        }
      }
    }

    function handleCallerModal(key: string, data: any) {
      resetFields(); // 重置表单
      if (key == "add") {
        formState.modalVisible = true;
        formState.modalTitle = true;
      } else if (key == "edit") {
        formState.modalVisible = true;
        formState.modalTitle = false;
        const arr: any = data.callers.split(",");
        // const formDatacallers: string[] = [];
        // arr.forEach((item: any) => {
        //   const rt: any | null = /(.+)?(?:\(|（)(.+)(?=\)|）)/.exec(item);
        //   formDatacallers.push( rt[1] + "," + data.id);
        // });
        formData.callers = arr.map((item: any, index: number) => {
          const rt: any | null = /(.+)?(?:\(|（)(.+)(?=\)|）)/.exec(item);
          return rt[1].replace(/(^\s*)|(\s*$)/g, "") + "," + data.id[index];
        });
        formData.groupName = data.groupName;
        formData.remark = data.remark;
        formData.callerGroupId = data.key;
      }
      handleTableTreeData();
    }

    async function handleCallerGroupDelete(key: any) {
      API.configListAPI
        .deleteCallerGroup({
          callerGroupId: key
        })
        .then(res => {
          // console.log(res);
          message.success("删除成功!");
          handleCallerGroupList();
        })
        .catch(e => {
          console.log("callerGroupAdd", e);
        });
    }

    function ok() {
      // console.log("模态框的方法");
      formState.pModalFormVisible = false;
    }

    // 生命周期
    onMounted(() => {
      // 调用当前方法
      handleCallerGroupList();
    });
    // 计算属性
    computed(() => {
      // handleTableTreeData;
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
      handleCallerModal,
      handleCallerGroupList,
      handleCallerGroupAddUpdate,
      handleTableTreeData,
      onDelete: handleCallerGroupDelete,
      ok
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
