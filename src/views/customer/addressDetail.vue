<template>
    <ec-dialog :show.sync="showDialog" :title="getTitle" @confirm="confirm" @addressEvent="addressEvent"
               :showCancelButton="true" :showConfirmButton="true" :showAddressButton="isAdd" width="400px">
        <el-form label-width="90px">
            <el-form-item label="收件人：">
                <el-input v-model="address.receiver" size="small" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
                <el-input v-model="address.phone" size="small" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="地址：">
                <el-input v-model="address.deliveryAddress" size="small" placeholder="地址"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="address.memo" size="small" placeholder="备注"></el-input>
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
            address: {
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
                    return this.isAdd ? "添加地址" : "编辑地址";
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
            addressEvent() {
                this.$emit('addressEvent', this.isAdd);
            }
        }
    };
</script>


