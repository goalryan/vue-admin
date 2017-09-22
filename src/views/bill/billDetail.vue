<template>
    <ec-page @close="close" title="添加账单">
        <!--<div class='page-space'>-->
        <!--<div>{{order.docNo}}</div>-->
        <!--</div>-->
        <ec-page-item>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="汇率:">
                    <el-input v-if="isEdit" v-model="order.taxRate" placeholder="请输入汇率"
                              @change="changeTaxRate"></el-input>
                    <p v-else="">{{order.taxRate}}</p>
                </el-form-item>
            </el-form>

            <el-table
                    :data="order.customers" :row-key="getRowKeys" :expand-row-keys="expands" :stripe="true"
                    @cell-click="cellClick"
                    :show-summary="true" style="width: 100%" height="550">
                <el-table-column label="序号" type="index" width="50" header-align="center" align="center">
                </el-table-column>
                <el-table-column type="expand">
                    <template scope="scope">
                        <products :products="scope.row.products" :taxRate="order.taxRate" :isEdit="isEdit"
                                  @updateCustomer="updateCustomer(scope.$index)"></products>
                    </template>
                </el-table-column>
                <el-table-column label="客户名称">
                    <template scope="scope">
                        <el-input v-if="isEdit" v-model="scope.row.customerName" size="small" placeholder="请输入客户名称"
                                  :disabled="!isEdit"></el-input>
                        <p v-else="">{{scope.row.customerName}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="数量" prop="quantity" align="center">
                </el-table-column>
                <el-table-column label="成本" prop="inTotalPrice" align="right">
                </el-table-column>
                <el-table-column label="收入" prop="outTotalPrice" align="right">
                </el-table-column>
                <el-table-column label="利润" prop="profit" align="right">
                </el-table-column>
                <el-table-column
                        prop="tag"
                        label="收款状态"
                        :filters="[{ text: '已收款', value: true }, { text: '未收款', value: false }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end" header-align="center" align="center">
                    <template scope="scope">
                        <el-tag :type="scope.row.isPaid? 'primary' : 'success'"
                                close-transition>{{paymentStatus(scope.row)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="收款" header-align="center" align="center">
                    <template scope="scope" v-if="isEdit">
                        <template v-if="isEdit">
                            <el-button size="small" type="text" @click="doOrCancelPaid(scope.row)">
                                {{operationText(scope.row)}}
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                    <template scope="scope">
                        <template v-if="isEdit">
                            <el-button v-if="scope.$index === order.customers.length - 1" size="small"
                                       type="text" @click="addCustomer(scope.$index+1)">添加
                            </el-button>
                            <el-button size="small" type="text" @click="delCustomer(scope.$index)">删除</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </ec-page-item>
        <ec-page-item slot="footer">
            <template v-if="isEdit">
                <el-button @click="cancel" type="primary">取消</el-button>
                <el-button @click="saveDoc" type="primary">保存</el-button>
            </template>
            <template v-else="">
                <el-button @click="close">关闭</el-button>
                <el-button @click="edit" type="primary">编辑</el-button>
                <el-button @click="delDoc" type="danger">删除</el-button>
            </template>
        </ec-page-item>
    </ec-page>
</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import store from '../../utils/store.js';
    import Products from './products.vue';
    import billCommon from './billCommon.js';
    export default {
        mixins: [MessageMixin],
        components: {
            Products
        },
        data () {
            return {
                isEdit: false,
                docNo: '',
                order: {
                    docNo: '',
                    taxRate: 1,
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
             * 是否添加
             */
            isAdd () {
                return this.$route.params.status === 'add';
            },
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
            this.isAdd ? this.addOrder() : this.selectDocNo();
        },
        methods: {
            close() {
                this.$router.back();
            },
            edit(){
                this.isEdit = true;
            },
            cancel(){
                this.isEdit = false;
            },
            addOrder(){
                this.docNo = billCommon.initBillDocNo();
                this.order.docNo = this.docNo;
                this.order.customers = [billCommon.initCustomer()];
            },
            selectDocNo(){
                this.docNo = this.$route.params.docNo;
                this.order = store.fetchBill(this.docNo);
                console.log(JSON.stringify(this.order));
            },
            addCustomer(index) {
                this.order.customers.push(billCommon.initCustomer());
                console.log(this.order);
            },
            delCustomer(index) {
                if (this.order.customers.length === 1) {
                    this.$message({ message: '必须保留一个客户', type: 'warning' });
                    return;
                }
                this.doConfirm(() => {
                    this.order.customers.splice(index, 1);
                }, `确定删除客户【${this.order.customers[index].customerName}】?`)
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
            saveDoc(){
                store.saveBill(this.order, this.docNo);
                this.$message({ message: '保存成功', type: 'success' });
            },
            delDoc() {
                this.doConfirm(() => {
                    store.delBill(this.docNo);
                    this.$message({ message: '删除成功', type: 'success' });
                });
            },
            getSummaries(param) {
                const { columns, data } = param;
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
                if (colName !== '客户名称' && colName !== '收款' && colName !== '操作') {
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

    /*.el-row {*/
    /*margin-bottom: 20px;*/

    /*&*/
    /*:last-child {*/
    /*margin-bottom: 0;*/
    /*}*/

    /*}*/

    /*.el-col {*/
    /*border-radius: 4px;*/
    /*}*/

    /*.demo-table-expand {*/
    /*font-size: 0;*/
    /*}*/

    /*.demo-table-expand label {*/
    /*width: 90px;*/
    /*color: #99a9bf;*/
    /*}*/

    /*.demo-table-expand .el-form-item {*/
    /*margin-right: 0;*/
    /*margin-bottom: 0;*/
    /*width: 50%;*/
    /*}*/

    /*.el-table {*/
    /*font-size: 13px;*/
    /*}*/

    /*.el-table th {*/
    /*text-align: center;*/
    /*}*/

    /*.el-table .cell, .el-table th > div {*/
    /*padding-left: 10px;*/
    /*padding-right: 10px;*/
    /*}*/

    /*.cell {*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*justify-content: center;*/
    /*}*/

    /*.el-form-item {*/
    /*margin-bottom: 5px;*/
    /*}*/

    /*.el-row {*/
    /*margin-bottom: 10px;*/
    /*}*/

    /*.el-input__inner {*/
    /*height: 25px;*/
    /*}*/

    /*.el-table__expanded-cell {*/
    /*padding: 10px 20px;*/
    /*}*/
</style>
