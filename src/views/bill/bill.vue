<template>
    <ec-container-item>
        <template slot="head">
            <el-button type="primary" @click="addBill()">添加账单</el-button>
        </template>

        <el-table :data="bills" highlight-current-row>
            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="docNo" label="单号" width="160" sortable>
                <template scope="scope">
                    <ec-text type="primary" @click="showBill(scope.row.docNo)">{{scope.row.docNo}}</ec-text>
                </template>
            </el-table-column>
            <el-table-column prop="taxRate" label="汇率" width="100"/>
            <el-table-column prop="memo" label="备注"/>
            <el-table-column label="操作" align="center" width="150">
                <template scope="scope">
                    <el-button type="primary" @click="editBill(scope.row.docNo)">编辑</el-button>
                    <el-button type="danger" @click="deleteBill(scope.$index, scope.row.docNo)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-bill-dialog :show.sync="showAddBillDialog" :docNo="selectedDocNo"
                         @confirm="addBillSuccess"></add-bill-dialog>
        <router-view @refresh="refresh"></router-view>
    </ec-container-item>

</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import AddBillDialog from './billAdd';
    import store from '../../utils/storeBill.js';
    import billCommon from './billCommon';

    export default {
        mixins: [MessageMixin],
        components: {
            AddBillDialog
        },
        data() {
            return {
                bills: [],
                showAddBillDialog: false,
                selectedDocNo: ''
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
                this.selectedDocNo = '';
                this.showAddBillDialog = true;
            },
            showBill(docNo) {
                this.$router.push({
                    name: 'billDetail',
                    params: { status: 'show', docNo: docNo }
                })
            },
            editBill(docNo) {
                this.selectedDocNo = docNo;
                this.showAddBillDialog = true;
            },
            deleteBill(index, docNo) {
                this.doConfirm(() => {
                    this.$http.delete('/api/bill/' + docNo)
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