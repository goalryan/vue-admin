<template>
    <ec-dialog :show.sync="showDialog" :title="getTitle" @confirm="confirm" @customerEvent="customerEvent"
               :showCancelButton="true" :showConfirmButton="true" :showCustomerButton="isAdd" width="400px">
        <el-form label-width="90px">
            <el-form-item label="姓名：">
                <el-input v-model="customer.name" size="small" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
                <el-input v-model="customer.phone" size="small" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="地址：">
                <el-input v-model="customer.address" size="small" placeholder="地址"></el-input>
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
                default: false
            },
            customer: {
                type: Object
            }
        },
        data() {
            return {};
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
                get() {
                    return this.isAdd ? "添加客户" : "编辑客户";
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
        methods: {
            confirm() {
                this.showDialog = false;
                this.$emit('confirm', this.isAdd);
            },
            customerEvent() {
                this.$emit('customerEvent', this.isAdd);
            }
        }
    };
</script>


