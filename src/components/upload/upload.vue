<template>
  <div class="upload-wrap" @click="handleClick">
    <slot>
      <div class="upload-text">
        <el-button size="small" type="primary">上传<i :class="{'el-icon-upload upload-icon--right':!uploading,'icon-loading upload-icon--right':uploading}"></i></el-button>
      </div>
    </slot>
    <input type="file" :value="fileData" ref="input" name="file" @change="fileChanged" class="upload-file" :multiple="multiple">
  </div>
</template>

<script>
  export default {
    name: 'EcUpload',
    props: {
      accept: {
        type: String,
        default: '.txt, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .wps, .rtf, .pdf, .xmind, .rp,.rar, .zip, .gz, .z, .7z,.bmp, .gif, .jpg, .jpeg, .pic, .png, .tif,.ai, .psd, .cdr,.svg'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      size: {
        type: Number,
        default: 5 * 1024 * 1024
      },
      action: {
        type: String,
        require: true
      }
    },
    data() {
      return {
        uploading: false,
        fileData: ''
      };
    },
    methods: {
      handleClick() {
        if (this.uploading) return;
        this.$refs.input.click();
      },
      fileChanged(e) {
        let files = Array.prototype.slice.call(e.target.files);
        if (files.length === 0) return;
        if (this.multiple && files.length > 1) {
          if (!this.checkExt(files)) {
            this.$ecConfirm({
              message: '您所选的文件中，有不支持的文件格式',
              subMessage: `支持的文件格式：${this.accept}`,
              showCancelButton: false,
              type: 'warning'
            });
            return;
          }
          if (!this.check(files)) {
            this.$message({
              message: `您所选的文件中，有文件大于${this.bytesToSize(this.size)},请重新选择文件`,
              type: 'warning'
            });
            return;
          }
          files.forEach((item) => {
            this.postData(item);
          });
        } else {
          files = e.target.files[0];
          if (!this.checkExt(files)) {
            this.$ecConfirm({
              message: '文件格式不支持',
              subMessage: `支持的文件格式：${this.accept}`,
              showCancelButton: false,
              type: 'warning'
            });
            return;
          }
          if (!this.check(files)) {
            this.$message({
              message: `您所选的文件大于${this.bytesToSize(this.size)},请重新选择文件`,
              type: 'warning'
            });
          } else {
            this.postData(files);
          }
        }
      },
      /**
       * ==============
       * 上传文件
       * ==============
       * */
      postData(file) {
          debugger;
        this.uploading = true;
        const formData = new FormData();
        formData.append('file', file);
        this.$http.post(this.action, formData).then(
          (res) => {
            const { success, data, errMsg } = res.data;
            this.uploading = false;
            if (success) {
              data.fileName = file.name;
              this.$emit('success', data);
            } else {
              this.$message({
                message: errMsg,
                type: 'error'
              });
            }
          }
        );
      },
      /**
       * ==============
       * 进行文件大小校验
       * ==============
       * */
      check(files) {
        if (Object.prototype.toString.call(files) === '[object Array]') {
          for (let i = 0, l = files.length; i < l; i += 1) {
            if (Number(files[i].size) > Number(this.size)) {
              return false;
            }
          }
        } else if (Number(files.size) > Number(this.size)) {
          return false;
        }
        return true;
      },
      /**
       * ==============
       * 检测文件类型
       * ==============
       * */
      checkExt(files) {
        if (Object.prototype.toString.call(files) === '[object Array]') {
          for (let i = 0, l = files.length; i < l; i += 1) {
            const ext = files[i].name.substr(files[i].name.lastIndexOf('.')).toLowerCase();
            if (this.accept.indexOf(ext) === -1) {
              return false;
            }
          }
        } else {
          const ext = files.name.substr(files.name.lastIndexOf('.')).toLowerCase();
          if (this.accept.indexOf(ext) === -1) {
            return false;
          }
        }
        return true;
      },
      /**
       * ==============
       * 转换文件大小
       * ==============
       * */
      bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / window.Math.pow(k, i)).toPrecision(3)} ${sizes[i]}`;
      }
    }
  };
</script>

<style lang="less">

</style>


