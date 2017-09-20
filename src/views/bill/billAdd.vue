<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="账单号:">{{order.docNo}}</el-form-item>
            <el-form-item label="汇率:">
                <el-input v-model="order.taxRate" placeholder="请输入汇率" @change="changeTaxRate"></el-input>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="12">
                <el-button size="small" @click="saveDoc">保存账单</el-button>
                <el-button size="small" @click="closeDoc">关闭账单</el-button>
                <el-button size="small" @click="delDoc">删除账单</el-button>
            </el-col>
        </el-row>
        <el-table
                :data="order.customers" :row-key="getRowKeys" :expand-row-keys="expands" :stripe="true"
                @cell-click="cellClick"
                :show-summary="true" style="width: 100%" height="550">
            <el-table-column label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column type="expand">
                <template scope="scope">
                    <child-list :products="scope.row.products" :taxRate="order.taxRate"
                                @updateCustomer="updateCustomer(scope.$index)"></child-list>
                </template>
            </el-table-column>
            <el-table-column label="客户名称">
                <template scope="scope">
                    <el-input v-model="scope.row.customerName" size="small" placeholder="请输入客户名称"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="数量" prop="quantity">
            </el-table-column>
            <el-table-column label="成本" prop="inTotalPrice">
            </el-table-column>
            <el-table-column label="收入" prop="outTotalPrice">
            </el-table-column>
            <el-table-column label="利润" prop="profit">
            </el-table-column>
            <el-table-column
                    prop="tag"
                    label="收款状态"
                    width="100"
                    :filters="[{ text: '已收款', value: true }, { text: '未收款', value: false }]"
                    :filter-method="filterTag"
                    filter-placement="bottom-end">
                <template scope="scope">
                    <el-tag :type="scope.row.isPaid? 'primary' : 'success'"
                            close-transition>{{paymentStatus(scope.row)}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="text" @click="doOrCancelPaid(scope.row)">{{operationText(scope.row)}}                    </el-button>
                    <el-button v-if="scope.$index === order.customers.length - 1" size="small"
                               type="text" @click="addCustomer(scope.$index+1)">添加
                    </el-button>
                    <el-button size="small" type="text" @click="delCustomer(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import Products from './products.vue';
    import store from '../../common/js/store.js';
    import common from './common.js';
    export default {
        components: {
            Products
        },
        data () {
            return {
                isEdit: false,
                docNo: '',
                docNoList: [],
                order: {
                    docNo: '',
                    taxRate: '1',
                    customers: []
                },
                // 获取row的key值
                getRowKeys(row) {
                    return row.id;
                },
                // 要展开的行，数值的元素是row的key值
                expands: []
            }
        },
        computed: {
            /**
             * 是否最后一行
             * @param index
             * @returns {boolean}
             */
            isLastRow: function (index) {
                return index === this.order.customers.length - 1;
            },
            /**
             * 是否付款
             * @param row
             * @returns {boolean}
             */
            isPaid: function (row) {
                return row.isPaid;
            }
        },
        mounted() {
            // 在这里你想初始化的时候展开哪一行都可以了
            // this.expands.push(this.order.customers[0].id);
            this.fetchDocNoList();
        },
        methods: {
            addOrder(){
                this.isEdit = true;
                this.initDocNo();
                this.order.docNo = this.docNo;
                this.order.customers = [common.initCustomer()];
            },
            fetchDocNoList() {
                this.docNoList = store.fetchDocNoList();
            },
            selectDocNo(){
                this.isEdit = true;
                this.order = store.fetchDoc(this.docNo);
                console.log(JSON.stringify(this.order));
            },
            addCustomer(index) {
                this.isEdit = true;
                this.initDocNo();
                this.order.docNo = this.docNo;
                this.order.customers.push(common.initCustomer());
                console.log(this.order);
            },
            delCustomer(index) {
                if (this.order.customers.length === 1) {
                    this.$message({message: '必须保留一个客户', type: 'warning'});
                    return;
                }
                this.confirmDialog(this.order.customers[index].customerName, () => {
                    this.order.customers.splice(index, 1);
                })
            },
            updateCustomer(index) {
                let quantity = 0;
                let inTotalPrice = 0;
                let outTotalPrice = 0;
                let profit = 0;
                this.order.customers[index].products.forEach((item) => {
                    quantity += parseFloat(item.quantity);
                    inTotalPrice += parseFloat(item.inTotalPrice);
                    outTotalPrice += parseFloat(item.outTotalPrice);
                    profit += parseFloat(item.profit);
                });
                this.order.customers[index].quantity = quantity;
                this.order.customers[index].inTotalPrice = inTotalPrice;
                this.order.customers[index].outTotalPrice = outTotalPrice;
                this.order.customers[index].profit = profit;
            },
            changeTaxRate() {
                this.order.customers.forEach((customer) => {
                    let totalProfit = 0;
                    customer.products.forEach((product) => {
                        if (product.isRMB) {
                            product.profit = (product.outTotalPrice - product.inTotalPrice).toFixed(0);
                        } else {
                            product.inTotalPrice = (product.inUnitPrice * product.quantity * this.order.taxRate).toFixed(0);
                            product.profit = (product.outTotalPrice - product.inTotalPrice).toFixed(0);
                        }
                        totalProfit += parseFloat(product.profit);
                    });
                    customer.profit = totalProfit;
                });
            },
            confirmDialog(customerName, callback) {
                this.$confirm(`确定删除客户【${customerName}】?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    callback();
                }).catch(() => {
                    this.$message({type: 'success', message: '已取消删除'});
                });
            },
            initDocNo() {
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                month = month < 10 ? `0${month}` : month;
                let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
                this.docNo = `${year}${month}${day}`;
                console.log(this.docNo);
            },
            saveDoc(){
                store.saveDoc(this.order, this.docNo);
                this.$message({message: '保存账单成功', type: 'success'});
            },
            delDoc() {
//                store.delDoc(this.docNo);
//                this.$message({message: '删除账单成功', type: 'success'});
//                this.fetchDocNoList();
//                this.isEdit = false;
//                this.docNo = '';
            },
            closeDoc(){
                this.isEdit = false;
                this.docNo = '';
                this.fetchDocNoList();
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总价';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' 元';
                    } else {
                        sums[index] = 'N/A';
                    }
                });
                return sums;
            },
            paymentStatus (row) {
                return row.isPaid ? '已收款' : '未收款';
            },
            operationText (row) {
                return row.isPaid ? '取消收款' : '收款';
            },
            /**
             * 过滤数据
             */
            filterTag(value, row) {
                return row.isPaid === value;
            },
            /**
             * 收款和取消收款操作
             */
            doOrCancelPaid(row) {
                row.isPaid = !row.isPaid;
            },
            /**
             * 只展开当前点击行
             * @param row
             * @param column
             * @param cell
             * @param event
             */
            cellClick(row, column, cell, event) {
                //console.log(column);
                const colName = column.label;
                if (colName !== '客户名称' && colName !== '操作') {
                    if (this.expands.length === 0) {
                        this.expands.push(row.id);
                    } else {
                        const obj = this.expands.filter(item => item === row.id);
                        this.expands = [];
                        if (obj.length === 0) {
                            this.expands.push(row.id);
                        }
                    }
                }
            }
        }
    }
</script>

<style>

    .el-row {
        margin-bottom: 20px;

    &
    :last-child {
        margin-bottom: 0;
    }

    }

    .el-col {
        border-radius: 4px;
    }

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .el-table {
        font-size: 13px;
    }

    .el-table th {
        text-align: center;
    }

    .el-table .cell, .el-table th > div {
        padding-left: 10px;
        padding-right: 10px;
    }

    .cell {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .el-form-item {
        margin-bottom: 5px;
    }

    .el-row {
        margin-bottom: 10px;
    }

    .el-input__inner {
        height: 25px;
    }

    .el-table__expanded-cell {
        padding: 10px 20px;
    }
</style>
