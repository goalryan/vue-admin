<template>
    <ec-container-item>
        <template slot="head">
            <el-button size="small" type="primary" @click="addBill()">添加账单</el-button>
            <el-button size="small" type="primary" @click="delAllBill()">删除账单</el-button>
        </template>

        <el-table :data="bills" highlight-current-row>
            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="docNo" label="单号" sortable>
                <template scope="scope">
                    <ec-text type="primary" @click="showBill(scope.row.docNo)">{{scope.row.docNo}}</ec-text>
                </template>
            </el-table-column>
            <!--<el-table-column label="操作" align="center" width="150">-->
            <!--<template scope="scope">-->
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <!--<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->
        </el-table>
        <router-view @refresh="refresh"></router-view>
    </ec-container-item>

</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import store from '../../utils/storeBill.js';
    import billCommon from './billCommon';
    export default {
        mixins: [MessageMixin],
        data() {
            return {
                bills: []
            }
        },
        mounted(){
            this.fetchBillList();
        },
        methods: {
            refresh(){
                this.fetchBillList();
            },
            fetchBillList(){
                this.bills = store.fetchBillList();
                console.log(this.bills);
            },
            addBill(){
                const docNo = this.checkExistDocNo();
                if (docNo === '') {
                    this.$router.push({
                        name: 'billDetail',
                        params: { status: 'add' }
                    })
                } else {
                    this.showBill(docNo);
                }
            },
            showBill(docNo){
                this.$router.push({
                    name: 'billDetail',
                    params: { status: 'show', docNo: docNo }
                })
            },
            delAllBill(){
                this.doConfirm(() => {
                    store.delAllBill();
                });
            },
            checkExistDocNo(){
                const docNo = billCommon.initBillDocNo();
                if (this.bills.findIndex(item => item.docNo === docNo) > -1) {
                    return docNo;
                } else {
                    return '';
                }
            }
        }
    }

</script>

<style scoped>

</style>