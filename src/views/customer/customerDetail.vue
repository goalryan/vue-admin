<template>
    <ec-dialog :show.sync="showDialog" :title="getTitle"
               :showCancelButton="false" :showConfirmButton="false" width="650px">
        <el-form label-width="120px">
            <el-form-item label="姓名：">
                <p>{{formData.header.productQuantity}}</p>
            </el-form-item>
            <el-form-item label="手机号：">
                <p>{{formData.header.completeQuantity}}</p>
            </el-form-item>
            <el-form-item label="地址：">
                <p>{{formData.header.redirectQuantity}}</p>
            </el-form-item>
        </el-form>
    </ec-dialog>
</template>

<script>
    export default {
        components: {},
        props: {
            show: {
                type: Boolean,
                default: false
            },
            isAdd: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                formData: {
                    header: {
                        productionQuantity: '',
                        finishedProductQuantity: '',
                        waitInboundQuantity: '',
                        inboundTotalQuantity: ''
                    }
                }
            };
        },
        computed: {
            showDialog: {
                get() {
                    return this.show;
                },
                set(val) {
                    this.$emit('update:show', val);
                }
            },
            getTitle: {
                get(){
                    return this.isAdd ? "d" : "编辑--客户";
                }
            }
        },
        watch: {
            show(val) {
                if (val) {
                    //this.getData();
                }
            }
        },
        methods: {}
    };
</script>


