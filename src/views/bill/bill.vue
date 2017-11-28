<template>
    <ec-container-item>
        <template slot="head">
            <el-form :inline="true" class="module-form">
                <el-form-item>
                    <el-button type="primary" @click="refresh()">刷新账单</el-button>
                    <el-button type="primary" @click="addBill()">添加账单</el-button>
                </el-form-item>
            </el-form>
        </template>

        <el-table :data="bills" highlight-current-row>
            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="docNo" label="单号" width="160" sortable>
                <template scope="scope">
                    <ec-text type="primary" @click="showBill(scope.row.id)">{{scope.row.docNo}}</ec-text>
                </template>
            </el-table-column>
            <el-table-column prop="taxRate" label="汇率"/>
            <!--<el-table-column prop="memo" label="备注"/>-->
            <el-table-column label="操作" align="center" width="150">
                <template scope="scope">
                    <el-button type="primary" @click="editBill(scope.row.id)">编辑</el-button>
                    <el-button type="danger" @click="deleteBill(scope.$index, scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-bill-dialog :show.sync="showAddBillDialog" :id="selectedBillId"
                         @confirm="addBillSuccess"></add-bill-dialog>
        <router-view @refresh="refresh"></router-view>
    </ec-container-item>

</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import AddBillDialog from './billAdd';
    import store from '../../utils/storeBill.js';
    import billCommon from './billCommon';
    import storeCustomer from '../../utils/storeCustomer.js';
    import GuidGenerate from '../../utils/GuidGenerate.js';

    export default {
        mixins: [MessageMixin],
        components: {
            AddBillDialog
        },
        data() {
            return {
                bills: [],
                showAddBillDialog: false,
                selectedBillId: ''
            }
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            refresh() {
                this.fetchData();
            },
            fetchData() {
                this.$http.get('/api/bill')
                    .then(res => {
                        if (res.success) {
                            this.bills = res.data;
                        } else {
                            this.$message({ message: res.msg, type: 'error' });
                        }
                    });
            },
            addBill() {
                this.selectedBillId = '';
                this.showAddBillDialog = true;
            },
            showBill(id) {
                this.$router.push({
                    name: 'billDetail',
                    params: { id: id }
                })
            },
            editBill(id) {
                this.selectedBillId = id;
                this.showAddBillDialog = true;
            },
            deleteBill(index, id) {
                this.doConfirm(() => {
                    this.$http.delete('/api/bill/' + id)
                        .then(res => {
                            if (res.success) {
                                this.bills.splice(index, 1);
                                this.$message({ message: '删除成功', type: 'success' });
                            } else {
                                this.$message({ message: res.msg, type: 'error' });
                            }
                        });
                })
            },
            addBillSuccess(msg) {
                this.$message({ message: msg, type: 'success' });
                this.fetchData();
            }
        }
    }

</script>

<style scoped>

</style>