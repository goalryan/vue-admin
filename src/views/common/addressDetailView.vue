<template>
    <ec-dialog :show.sync="showDialog" :title="getTitle" @confirm="confirm" @customerEvent="customerEvent"
               :showCancelButton="true" :showConfirmButton="true" :showCustomerButton="isCustomer" width="400px">
        <el-form label-width="90px">
            <el-form-item label="收件人：">
                <el-input v-model="address.receiver" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
                <el-input v-model="address.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="地址：">
                <el-input v-model="address.deliveryAddress" placeholder="地址"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="address.memo" placeholder="备注"></el-input>
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
            isCustomer: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
                default: false
            },
            customerId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                address: {}
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
                get() {
                    return this.isAdd ? "添加收货地址" : "编辑收货地址";
                }
            }
        },
        watch: {
            show(val) {
                if (val) {
                    this.isAdd ? this.initData() : this.fetchData();
                }
            }
        },
        methods: {
            fetchData() {
                this.$http.get(`api/address/${this.id}`)
                    .then(res => {
                        if (res.success) {
                            this.address = res.data;
                        } else {
                            this.$message({message: res.msg, type: 'error'});
                        }
                    })
            },
            initData() {
                this.address = {
                    customerId: this.customerId,
                    receiver: '',
                    phone: '',
                    deliveryAddress: '',
                    memo: ''
                }
            },
            confirm() {
                if (this.isAdd) {
                    this.add(false);
                } else {
                    this.$http.put(`api/address/${this.id}`, this.address)
                        .then(res => {
                            if (res.success) {
                                this.showDialog = false;
                                this.$emit('confirm');
                            } else {
                                this.$message({message: res.msg, type: 'error'});
                            }
                        })
                }

            },
            customerEvent() {
                this.add(true);
                this.initData();
            },
            add(next) {
                if (!this.checkData()) return;
                debugger;
                this.$http.post(`api/address/add`, this.address)
                    .then(res => {
                        if (res.success) {
                            this.showDialog = next;
                            this.$emit('confirm');
                        } else {
                            this.$message({message: res.msg, type: 'error'});
                        }
                    })
            },
            checkData() {
                if (!this.doCheck(this.address.receiver, '收件人')) return false;
                if (!this.doCheck(this.address.phone, '手机号')) return false;
                if (!this.doCheck(this.address.deliveryAddress, '地址')) return false;
                return true;
            },
            doCheck(value, msg) {
                if (value === '') {
                    this.$message({message: `请输入${msg}`, type: 'info'});
                    return false;
                }
                return true;
            }
        }
    };
</script>


