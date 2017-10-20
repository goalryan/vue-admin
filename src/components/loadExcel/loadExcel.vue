<template>
    <div class="upload-wrap" @click="handleClick">
        <slot>
            <div class="upload-text">
                <el-button size="small" type="primary">上传<i
                        :class="{'el-icon-upload upload-icon--right':!uploading,'icon-loading upload-icon--right':uploading}"></i>
                </el-button>
            </div>
        </slot>
        <input type="file" :value="fileData" ref="input" name="file" @change="fileChanged" class="upload-file">
    </div>
</template>

<script>
    import XLSX from 'xlsx';

    export default {
        name: 'EcLoadExcel',
        props: {
            accept: {
                type: String,
                default: '.xls, .xlsx'
            },
            size: {
                type: Number,
                default: 5 * 1024 * 1024
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
                if (files.length > 1) {
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
                        this.loadData(item);
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
                        this.loadData(files);
                    }
                }
            },
            /**
             * ==============
             * 上传文件
             * ==============
             * */
            loadData(file) {
                //修改了这个状态，要还原为true
                this.uploading = false;
                var fileReader = new FileReader();
                var jsonData = []; // 存储获取到的数据
                var _this = this;
                fileReader.onload = function (ev) {
                    try {
                        var data = ev.target.result,
                            workbook = XLSX.read(data, {
                                type: 'binary'
                            }) // 以二进制流方式读取得到整份excel表格对象

                    } catch (e) {
                        console.log('文件类型不正确');
                        return;
                    }

                    // 表格的表格范围，可用于判断表头是否数量是否正确
                    var fromTo = '';
                    // 遍历每张表读取
                    for (var sheet in workbook.Sheets) {
                        if (workbook.Sheets.hasOwnProperty(sheet)) {
                            fromTo = workbook.Sheets[sheet]['!ref'];
                            console.log(fromTo);
                            jsonData = jsonData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                            break; // 如果只取第一张表，就取消注释这行
                        }
                    }
                    _this.$emit('success', jsonData);
                };
                // 以二进制方式打开文件
                fileReader.readAsBinaryString(file);
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


