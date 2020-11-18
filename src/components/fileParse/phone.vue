<template>
  <div>
    <a-upload
      v-model:fileList="datas.fileList"
      name="file"
      action=""
      accept=".xls,.xlsx,.txt"
      @change="addFile"
      :showUploadList="false"
    >
      <a-button type="primary" :loading="visibleState.resolveData"
        >选择文件</a-button
      >
      <span class="hint-span">只支持.xls,.xlsx,.txt文件</span>
    </a-upload>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, nextTick } from "vue";
import { message } from "ant-design-vue";
import XLSX from "xlsx";

export default defineComponent({
  /** 所有的代码逻辑将在setup方法中实现，并且不再有this */
  setup(prop, { emit }) {
    /** 返回值 */
    // 数据
    const datas: any = reactive({
      fileList: [],
      resolveData: false
    });
    // 判断可上传啥，这里是数字
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
        emit("input", result);
        emit("change", result);
        // console.log("result", result)
        datas.fileList = result;
      } else {
        message.error("号码只能为数字,文件包含有其他字符，请检查", 2);
      }
      nextTick(() => {
        datas.resolveData = false;
      });
    }
    // 前端解析电话号码文件
    function addFile(allFile: any) {
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
            datas.resolveData = false;
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
        datas.resolveData = false;
        message.warning("文件格式不支持");
        fileList.pop();
      }
    }

    /** 返回值  */
    return {
      datas,
      addFile
    };
  }
});
</script>
<style lang="stylus" scoped>
.hint-span{
  color: black;
  font-size: 12px;
  margin-left: 4px;
}
</style>
