<template>
  <div class="valid-time">
    <a-button @click="add">添加</a-button>
    <div class="result-list">
      <div v-for="(item, index) in datas.currentValue" :key="index" class="result-item">
        <div class="item-btn">
          <EditOutlined @click="editChild(index)"/>
          <a-divider type="vertical" />
          <DeleteOutlined @click="delChild(index)" />
        </div>
        星期：{{ item.week.map((week, num) => week ? datas.dayObj[num + 1] : '').filter(item => item).join('，') }}
        <br>
        时间：{{ item.startTime }} - {{ item.endTime }}
      </div>
    </div>
    <a-modal
      :visible="datas.visible"
      :title="datas.visibleTitle ? '添加可呼叫时段' : '修改可呼叫时段'"
      :maskStyle="{'z-index':1001}"
      width="500px"
      cancelText="取消"
      okText="确定"
      @cancel="cancel"
      @ok="confirm"
    >
      <a-form 
        ref="ruleForm"
        :model="modelRef"
        :rules="rulesRef"
        :label-col="{ span: 6 }" 
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="可用星期" name="week">
          <a-select 
            mode="tags" 
            v-model:value="modelRef.week" 
            multiple 
            placeholder="请选择"
            :allowClear="true"
            style="dispaly:inline-block;width:60%"
          >
            <a-select-option v-for="i in 7" :key="i">
              {{ '星期' + datas.dayObj[i] }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="可用时间段" name="startTime">
          <div style="dispaly:inline-block;">
            <a-select v-model:value="modelRef.startTime" style="width: 28.5%; dispaly: inline-block;" :allowClear="true" @focus="getTimePicker">
              <template #suffixIcon><ClockCircleOutlined /></template>
              <a-select-option v-for="item in datas.optionTime" :key="item">
                {{ item }}
              </a-select-option>
            </a-select>
            -
            <a-select v-model:value="modelRef.endTime" style="width: 28.5%; dispaly: inline-block;" :allowClear="true"  @focus="getTimePicker">
              <template #suffixIcon><ClockCircleOutlined /></template>
              <a-select-option v-for="item in datas.optionTime" :key="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { 
  defineComponent,
  reactive,
  ref,
  unref,
  onMounted,
  computed,
  watch
} from 'vue';
import { ClockCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';
import { message } from "ant-design-vue";
export default {
  components: {
    ClockCircleOutlined,
    EditOutlined,
    DeleteOutlined
  },
  name: "addTimes",
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props, { emit }) {
     const modelRef = reactive({
      week: [],
      startTime: '',
      endTime: '',
    });
    const ruleForm = ref(null);
    const rulesRef = reactive({
      week: [
        {
          required: true,
          message: '请选择可用星期'
        }
      ],
      startTime: [
        {
          required: true,
          message: '请选择可用时间段'
        }
      ]
    });
    const { resetFields } = useForm(modelRef, rulesRef);
    const datas = reactive({
      visible: false,
      visibleTitle: false,
      tips: '',
      dayObj: ['', '一', '二', '三', '四', '五', '六', '日'],
      optionTime: [],
      currentValue: [],
      editCurrent: ''
    });   
    function cancel() {      
      datas.visible = false;
      resetFields();
    }
    function add() {      
      datas.editCurrent = '';
      datas.visible = true;
      getTimePicker();
    }
    function getTimePicker() {      
      // 从开始时间生成固定时间间隔的时间值 8:30 - 21:00
      let minute = 15; //间隔分钟
      let seconds = minute * 60;
      let len = (60*14*60)/seconds; //数组长度
      for(var i=0,total = (8*60*60),newArr = [];i<len;i++){
        let h = parseInt(total/3600),
        min = parseInt(total%3600/60);
        if((h==8 && 30<=min) || 9<=h && !(h==21&&min>0)) {
          const time = s(h)+':'+s(min)
          newArr.push(time)
        }
        total+=seconds;
      }
      return datas.optionTime = newArr;
      function s(n){
        return ( n<10 ? '0' + n : n )
      }
    }
    async function confirm() {
      // visibleChange(true);
      const form = unref(ruleForm);
      if (!form) return;
      if (!modelRef.endTime) {
        return message.warning('请完整选择时间段');
      }
      try {
        const data = await form.validate();
        if (new Date(`2020-01-01 ${data.startTime}:00`) >= new Date(`2020-01-01 ${modelRef.endTime}:00`)) {
          message.warning('开始时间不能大于结束时间');
        } else {
          const result = {
            startTime: data.startTime,
            endTime: modelRef.endTime,
            week: [0, 0, 0, 0, 0, 0, 0].map((item, index) => {
              if (data.week.includes(index + 1)) return 1
              else return 0
            })
          }
          if (datas.editCurrent !== '') {
            datas.currentValue[datas.editCurrent] = result;
          } else {
            datas.currentValue.push(result);
          }            
          datas.visible = false;
          emitChange()
          resetFields(); // 重置表单
        }
      } catch (error) {
        console.log('error', error);
      }
    }
    function emitChange() {
      emit('input', datas.currentValue)
      emit('change', datas.currentValue)
    }
    function delChild(index) {
      datas.currentValue.splice(index, 1);
    }
    function editChild(index) {
      datas.editCurrent = index;
      modelRef.week = datas.currentValue[index].week.map((week, num) => week ? num + 1 : '').filter(item => item);
      modelRef.startTime = datas.currentValue[index].startTime;
      modelRef.endTime = datas.currentValue[index].endTime;
      datas.visible = true;
    }
    function resetValue() {
      if ([null, undefined, ''].includes(props.value)) {
        datas.currentValue = [];
        emitChange();
      } else if (JSON.stringify(props.value) !== JSON.stringify(datas.currentValue)) {
        datas.currentValue = props.value
      }
    }    
    watch(props, (old,news) => {
      // console.log("old,news:--------", old,news);
      resetValue()
    });
    // 生命周期
    onMounted(() => {
      // 调用当前方法
      resetValue()
    });
    return {
      ruleForm,
      rulesRef,
      modelRef,
      datas,
      cancel,
      getTimePicker,
      add,
      confirm,
      delChild,
      emitChange,
      editChild
    };
  },
};
</script>
<style lang="stylus" scoped>
.result-item {
    position: relative;
    margin-top: 8px;
    padding: 0px 15px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    .item-btn {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 20px;
      text-align: right;
      line-height: 20px;
      [class^="a-icon-"] {
        margin-right: 5px;
        cursor: pointer;
        &:hover {
          color: #409EFF
        }
      }
    }
  }
</style>