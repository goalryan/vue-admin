<template>
    <ec-dialog :show.sync="showDialog" :title="getTitle" @confirm="confirm" @cancel="cancel"
               :showCancelButton="true" :showConfirmButton="true" width="400px">
        <el-form label-width="90px">
            <el-form-item label="汇率：">
                <el-input v-model="bill.taxRate" size="small" placeholder="请输入汇率"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="bill.memo" size="small" placeholder="请输入备注"></el-input>
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
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                bill: {
                    id: '',
                    docNo: '',
                    taxRate: 1,
                    memo: ''
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
                get() {
                    return this.id === '' ? "添加账单" : '编辑账单';
                }
            }
        },
        watch: {
            show(val) {
                if (val) {
                    this.getData();
                }
            }
        },
        methods: {
            getData() {
                if (this.id != '') {
                    const queryData = { id: this.id };
                    this.$http.get(`/api/bill/info`, { params: queryData })
                        .then(res => {
                            if (res.success) {
                                this.bill = res.data;
                            } else {
                                this.$message({ message: res.msg, type: 'error' });
                            }
                        });
                }

            },
            confirm() {
                if (this.id != '') {
                    this.$http.put(`/api/bill/${this.id}`, this.bill)
                        .then(res => {
                            if (res.success) {
                                this.reset();
                                this.$emit('confirm', '更新成功');
                            } else {
                                this.$message({ message: res.msg, type: 'error' });
                            }
                        });
                } else {
                    this.$http.post('/api/bill/add', this.bill)
                        .then(res => {
                            if (res.success) {
                                this.reset();
                                this.$emit('confirm', '添加成功');
                            } else {
                                this.$message({ message: res.msg, type: 'error' });
                            }
                        });
                }

            },
            cancel() {
                this.reset();
            },
            reset() {
                this.showDialog = false;
                this.bill = {
                    docNo: '',
                    taxRate: 1,
                    memo: ''
                }

            }
        }
    };
</script>


