<template>
    <ec-page @close="close" :title="bill.docNo">
        <ec-page-item>
            <el-form :inline="true">
                <el-form-item label="汇率:">
                    <el-input v-if="isEdit" v-model="bill.taxRate" placeholder="请输入汇率"
                              @change="changeTaxRate"></el-input>
                    <p v-else="">{{bill.taxRate}}</p>
                </el-form-item>
            </el-form>

            <el-table
                    :data="bill.customerList" :row-key="getRowKeys" :expand-row-keys="expands" :stripe="true"
                    @cell-click="cellClick"
                    :show-summary="true" class="ec-table-page" height="500">
                <el-table-column label="序号" type="index" width="50" header-align="center" align="center">
                </el-table-column>
                <el-table-column type="expand">
                    <template scope="scope">
                        <products :docNo="bill.docNo" :billCustomerId="scope.row.id"
                                  :goodsList="scope.row.goodsList" :taxRate="bill.taxRate" :isEdit="isEdit"
                                  @updateCustomer="updateCustomer(scope.$index)"></products>
                    </template>
                </el-table-column>
                <el-table-column label="客户名称">
                    <template scope="scope">
                        <el-input v-if="isEdit" v-model="scope.row.customerNickName" placeholder="请输入客户名称"></el-input>
                        <p v-else="">{{scope.row.customerNickName}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="数量" prop="quantity" header-align="right" align="right">
                </el-table-column>
                <el-table-column label="成本" prop="inTotalPrice" header-align="right" align="right">
                </el-table-column>
                <el-table-column label="收入" prop="outTotalPrice" header-align="right" align="right">
                </el-table-column>
                <el-table-column label="利润" prop="profit" header-align="right" align="right">
                </el-table-column>
                <el-table-column
                        prop="tag"
                        label="收款状态"
                        :filters="[{ text: '已收款', value: true }, { text: '未收款', value: false }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end" header-align="right" align="right" width="100">
                    <template scope="scope">
                        <el-tag :type="scope.row.isPaid? 'primary' : 'success'"
                                close-transition>{{paymentStatus(scope.row)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="收款" header-align="center" align="center" width="100">
                    <template scope="scope" v-if="isEdit">
                        <template v-if="isEdit">
                            <el-button type="text" @click="doOrCancelPaid(scope.row)">
                                {{operationText(scope.row)}}
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" align="center" width="100">
                    <template scope="scope">
                        <template v-if="isEdit">
                            <el-button v-if="scope.$index === bill.customerList.length - 1"
                                       type="text" @click="addCustomer(scope.$index+1)">添加


                            </el-button>
                            <el-button type="text" @click="deleteCustomer(scope.$index)">删除</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </ec-page-item>
        <ec-page-item slot="footer">
            <template v-if="isEdit">
                <el-button @click="cancel">取消</el-button>
                <el-button @click="saveBill" type="primary" :disabled="isLock">保存</el-button>
            </template>
            <template v-else="">
                <el-button @click="close">关闭</el-button>
                <el-button @click="edit" type="primary">编辑</el-button>
            </template>
        </ec-page-item>
    </ec-page>
</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import Products from './products.vue';
    import billCommon from './billCommon.js';

    export default {
        mixins: [MessageMixin],
        components: {
            Products
        },
        data() {
            return {
                isEdit: false,
                bill: {
                    docNo: '',
                    taxRate: '',
                    isClose: false,
                    customerList: []
                },
                // 获取row的key值
                getRowKeys(row) {
                    return row.id;
                },
                // 要展开的行，数值的元素是row的key值
                expands: [],
                lock: false
            }
        },
        computed: {
            isLock() {
                return this.lock;
            }
        },
        mounted() {
            this.bill.docNo = this.$route.params.docNo;
            this.fetchData();
        },
        methods: {
            close() {
                this.$router.back();
                this.$emit('refresh');
            },
            edit() {
                this.isEdit = true;
            },
            cancel() {
                this.isEdit = false;
            },
            fetchData() {
                const queryData = {docNo: this.bill.docNo};
                this.$http.get(`/api/bill/detail`, {params: queryData})
                    .then(res => {
                        if (res.success) {
                            this.bill = res.result;
                            if (this.bill.customerList.length === 0) {
                                this.bill.customerList.push(billCommon.initCustomer(this.bill.docNo));
                            }
                        } else {
                            this.$message({message: res.msg, type: 'error'});
                        }
                    });
            },
            addCustomer(index) {
                this.bill.customerList.push(billCommon.initCustomer(this.bill.docNo));
            },
            updateCustomer(index) {
                let quantity = 0;
                let inTotalPrice = 0;
                let outTotalPrice = 0;
                let profit = 0;
                this.bill.customerList[index].goodsList.forEach((item) => {
                    quantity += parseFloat(item.quantity);
                    inTotalPrice += parseFloat(item.inTotalPrice);
                    outTotalPrice += parseFloat(item.outTotalPrice);
                    profit += parseFloat(item.profit);
                });
                this.bill.customerList[index].quantity = quantity;
                this.bill.customerList[index].inTotalPrice = inTotalPrice;
                this.bill.customerList[index].outTotalPrice = outTotalPrice;
                this.bill.customerList[index].profit = profit;
            },
            changeTaxRate() {
                this.bill.customerList.forEach((customer) => {
                    let totalProfit = 0;
                    customer.goodsList.forEach((product) => {
                        if (product.isRMB) {
                            product.profit = (product.outTotalPrice - product.inTotalPrice).toFixed(0);
                        } else {
                            product.inTotalPrice = (product.inUnitPrice * product.quantity * this.bill.taxRate).toFixed(0);
                            product.profit = (product.outTotalPrice - product.inTotalPrice).toFixed(0);
                        }
                        totalProfit += parseFloat(product.profit);
                    });
                    customer.profit = totalProfit;
                });
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
            paymentStatus(row) {
                return row.isPaid ? '已收款' : '未收款';
            },
            operationText(row) {
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
            },
            saveBill() {
                this.lock = true;
                this.$http.post('/api/bill/save', this.bill)
                    .then(res => {
                        debugger;
                        if (res.success) {
                            this.setRowStatus();
                            this.$message({message: '保存成功', type: 'success'});
                        } else {
                            this.$message({message: res.msg, type: 'error'});
                        }
                        this.lock = false;
                    })
                    .catch(e => {
                        this.lock = false;
                    });

            },
            deleteCustomer(index) {
                if (this.bill.customerList.length === 1) {
                    this.$message({message: '必须保留一个客户', type: 'warning'});
                    return;
                }
                this.doConfirm(() => {
                    this.bill.customerList.splice(index, 1);
                }, `确定删除客户【${this.bill.customerList[index].customerNickName}】?`)
            },
            setRowStatus() {
                this.bill.customerList.forEach(customer => {
                    customer.isAdd = false;
                    customer.goodsList.forEach(goods => {
                        goods.isAdd = false;
                    })
                })
            }
        }
    }
</script>

<style>
</style>
