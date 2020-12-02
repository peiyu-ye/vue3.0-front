<template>
  <div class="k-uploader">
    <div class="k-uploader_hd">
      <div class="k-uploader_title">{{ title }}</div>
      <div class="k-uploader_info">{{ fileList.length }} / {{ limit }}</div>
    </div>
    <div class="k-uploader_bd">
      <ul class="k-uploader_files">
        <li
          :class="{
              'k-uploader_file': true,
              'k-uploader_file-status': !!item.fetchStatus && item.fetchStatus !== 'success'
            }"
          v-for="(item, index) in fileList"
          :key="index"
          :style="{
              backgroundImage: `url(${item.url})`
            }"
          @click="handleFileClick($event, item, index)"
        ></li>
      </ul>
      <div class="k-uploader_input-box" v-show="fileList.length < limit && !readonly">
        <input
          class="k-uploader_input"
          ref="input"
          type="file"
          name="uploadInput"
          accept="image/*"
          :capture="capture"
          :multiple="multiple"
          @change="handleChange"
          :value="inputValue"
        />
      </div>
    </div>

    <div class="k-uploader_previewer" id="previewer" v-if="previewVisible">
      <div
        ref="previewerImg"
        class="k-uploader_preview-img"
        id="previewerImg"
        @click="handleHide"
        :style="{
              backgroundImage: `url(${currentImg})`
        }"
      ></div>

      <div class="k-uploader_del" v-if="!readonly" @click="handleDelete"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, watchEffect } from "vue";
import { handleFile, transformCoordinate, dataURItoBlob } from "./index.js";
// 文件信息接口
interface IFile {
  url: string;
}
interface IFileItem {
  url: string;
  blob: any;
}
// InputEvent接口
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
export default {
  name: "Uploader",
  props: {
    title: {
      type: String,
      default: "图片上传",
    },
    files: {
      type: Array, //初始化数据源
      default: () => [],
    },
    limit: {
      type: Number, //限制上传图片个数
      default: 9,
    },
    capture: {
      type: Boolean, //是否只选择调用相机
      default: false,
    },
    enableCompress: {
      type: Boolean, //是否压缩
      default: true,
    },
    maxWidth: {
      type: Number, //图片压缩最大宽度
      default: 1024,
    },
    quality: {
      type: Number, //图片压缩率
      default: 0.9,
    },
    url: {
      type: String, //上传服务器url
      default: "",
    },
    params: {
      type: Object, //上传文件时携带的自定义参数
      default: () => {},
    },
    name: {
      type: String, //上传文件时FormData的Key，默认为file
      default: "file",
    },
    autoUpload: {
      type: Boolean, //是否自动开启上传
      default: true,
    },
    multiple: {
      type: Boolean, //是否支持多选, `false`为不支持
      default: "",
    },
    readonly: {
      type: Boolean, //只读模式（隐藏添加和删除按钮）
      default: false,
    },
  },
  setup(props, { emit }) {
    // 待上传文件
    let fileList = reactive<any[]>(props.files);
    //fileList = files;
    // 预览开关
    let previewVisible = ref<Boolean>(false);
    // 当前预览的图片序号
    let currentIndex = ref(0);
    // 定义当前预览图片img
    let currentImg = ref<string | null>("");
    let inputValue = ref<string | null>("");

    watchEffect(() => {});

    // 文件变更操作
    const handleChange = (event: HTMLInputEvent): void => {
      const { enableCompress, maxWidth, quality, autoUpload } = props;
      const target = event.target || event.srcElement;
      const inputChangeFiles: [] | any = target.files;
      // console.log("files", inputChangeFiles);
      if (inputChangeFiles.length <= 0) {
        // 调用取消
        return;
      }
      const fileCount = fileList.length + inputChangeFiles.length;
      if (fileCount > props.limit) {
        alert(`不能上传超过${props.limit}张图片`);
        return;
      }
      // console.log("handleFile");
      // 执行操作
      Promise.all(
        Array.prototype.map.call(inputChangeFiles, (file) => {
          return handleFile(file, {
            maxWidth,
            quality,
            enableCompress,
          }).then((blob) => {
            const blobURL = URL.createObjectURL(blob);
            const fileItem: any = <IFileItem>{
              url: blobURL,
              blob,
            };
            for (let key in file) {
              if (["slice", "webkitRelativePath"].indexOf(key) === -1) {
                fileItem[key] = file[key];
              }
            }
            if (autoUpload) {
              uploadFile(blob, fileItem)
                .then((result) => {
                  fileList.push(fileItem);
                  // 回调方法
                  // vue2.x写法 ：this.$emit('on-change', fileList);
                  emit("on-change", fileList);
                  console.log("success");
                })
                .catch((e) => {
                  fileList.push(fileItem);
                });
            } else {
            }
          });
        })
      ).then(() => {
        inputValue.value = "";
      });
    };

    // 上传文件
    const uploadFile = (blob: string, fileItem: any) => {
      return new Promise((resolve, reject) => {
        // 暂时resolve 模拟返回 正式使用请删掉
        const result = {
          status: 1,
          msg: "上传成功",
          data: {
            filename: "图片名字",
            url:
              "https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg",
          },
        };
        resolve(result);
        emit("on-success", result);
        return;

        const formData = new FormData();
        const xhr = new XMLHttpRequest();

        formData.append(props.name, blob);
        if (props.params) {
          for (let key in props.params) {
            formData.append(key, props.params[key]);
          }
        }
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 1) {
            if (localStorage.getItem("token")) {
              const accessToken: any = localStorage.getItem("token");
              xhr.setRequestHeader("Authorization", accessToken);
            }
          }
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const result = JSON.parse(xhr.responseText);
              // 回调父页面on-success
              // vue2.x写法 this.$emit("on-success", result, fileItem);
              emit("on-success", result, fileItem);
              resolve(result);
            } else {
              // 回调父页面on-error
              // vue2.x写法 this.$emit("on-error", xhr);
              emit("on-error", xhr);
              reject(xhr);
            }
          }
        };
        xhr.upload.addEventListener(
          "progress",
          function (evt) {
            if (evt.lengthComputable) {
              const precent = Math.ceil((evt.loaded / evt.total) * 100);
              // 上传进度
            }
          },
          false
        );
        xhr.open("POST", props.url, true);
        xhr.send(formData);
      });
    };

    // 预览图片、删除图片
    const handleFileClick = (
      e: MouseEvent,
      item: IFile,
      index: number
    ): void => {
      showPreviewer();
      currentImg.value = item.url;
      currentIndex.value = index;
    };

    // 显示预览
    const showPreviewer = () => {
      previewVisible.value = true;
    };

    // 隐藏预览
    const handleHide = () => {
      previewVisible.value = false;
    };

    // 删除图片
    const handleDelete = () => {
      const delFn = () => {
        handleHide();
        fileList.splice(currentIndex.value, 1);
        emit("on-change", fileList);
      };
      delFn();
    };

    return {
      fileList,
      previewVisible,
      currentImg,
      inputValue,
      handleChange,
      handleFileClick,
      handleHide,
      handleDelete,
    };
  },
};
</script>

<style lang="stylus" scoped>
.k-uploader {
  padding: 10px 15px;
  .k-uploader_hd {
    display: flex;
    padding-bottom: 10px;
    .k-uploader_title {
      flex: 1;
      text-align: left;
    }
    .k-uploader_info {
      color: #b2b2b2;
    }
  }
  .k-uploader_bd {
    overflow: hidden;
    margin-left: -9px;
    .k-uploader_files {
      list-style: none;
      padding: 0;
      .k-uploader_file {
        float: left;
        margin-left: 9px;
        margin-bottom: 9px;
        width: 74px;
        height: 74px;
        background: no-repeat center center;
        background-size: cover;
      }
      .k-uploader_file-status {
        position: relative;
        &:before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.4);
        }
      }
      .k-uploader_file-content {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        color: #fff;
        .upload-error {
          display: inline-block;
          font-size: 23px;
          color: #f43530;
          font-family: "weui";
          font-style: normal;
          &:before {
            content: "\EA0B";
          }
        }
      }
    }
    .k-uploader_input-box {
      float: left;
      position: relative;
      margin-left: 9px;
      margin-bottom: 9px;
      width: 74px;
      height: 74px;
      border: 1px solid #d9d9d9;
      &:before,
      &:after {
        content: " ";
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        background-color: #d9d9d9;
      }
      &:before {
        width: 2px;
        height: 39.5px;
      }
      &:after {
        width: 39.5px;
        height: 2px;
      }
      .k-uploader_input {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
    }
  }
  .k-uploader_previewer {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #000;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    .k-uploader_preview-img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 60px;
      left: 0;
      background: center center no-repeat;
      background-size: contain;
    }
    .k-uploader_del {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgb(191 132 49);
      color: #ffffff;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-family: "weui";
      &:after {
        color: #ffffff;
        font-size: 16px;
        content: "删除";
      }
    }
  }
}
</style>>
