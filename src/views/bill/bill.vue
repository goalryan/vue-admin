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
                    <ec-text type="primary" @click="showBill(scope.row)">{{scope.row.docNo}}</ec-text>
                </template>
            </el-table-column>
            <!--<el-table-column label="操作" align="center" width="150">-->
            <!--<template scope="scope">-->
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <!--<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->
        </el-table>
        <router-view></router-view>
    </ec-container-item>

</template>

<script>
    import store from '../../common/js/store.js';
    export default {
        data() {
            return {
                bills: [
                    { docNo: '20170910' },
                    { docNo: '20170911' },
                    { docNo: '20170912' },
                ]
            }
        },
        mounted(){
            console.log(store.fetchStorage());
            this.fetchBillList();
        },
        methods: {
            fetchBillList(){
                this.bills = store.fetchBillList();
                console.log(this.bills);
            },
            addBill(){
                this.$router.push({
                    name: 'billDetail',
                    params: { status: 'add' }
                })
            },
            showBill(obj){
                this.$router.push({
                    name: 'billDetail',
                    params: { status: 'show', docNo: obj.docNo }
                })
            },
            delAllBill(){
                store.delAllBill();
            }
        }
    }

</script>

<style scoped>

</style>