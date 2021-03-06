<template>
    <ec-page @close="close" :title="bill.docNo">
        <address-list-dialog :show.sync="showAddressListDialog"
                             :billCustomer="currentRow"></address-list-dialog>
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
                    :show-summary="true" class="ec-table-page">
                <el-table-column type="expand">
                    <template scope="scope">
                        <products :billId="bill.id" :billCustomerId="scope.row.id"
                                  :goodsList="scope.row.goodsList" :taxRate="bill.taxRate" :isEdit="isEdit"
                                  @updateCustomer="updateCustomer(scope.$index)"
                                  @deleteGoodsEvent="deleteGoodsEvent"></products>
                    </template>
                </el-table-column>
                <el-table-column label="序号" type="index" width="50" header-align="center" align="center">
                </el-table-column>
                <el-table-column label="客户名称" width="200">
                    <template scope="scope">
                        <el-autocomplete v-if="isEdit"
                                         v-model="scope.row.customerNickName"
                                         :fetch-suggestions="querySearchAsync"
                                         placeholder="请输入客户名称"
                                         @select="handleSelect"
                                         @blur="insertNewCustomer"></el-autocomplete>
                        <p v-else="">{{scope.row.customerNickName}}</p>
                    </template>
                </el-table-column>
                <el-table-column v-if="!isEdit" label="收货地址" header-align="center" align="center">
                    <template scope="scope">
                        <template v-if="scope.row.customerId!==''">
                            <el-button v-if="!scope.row.addressId||scope.row.addressId === ''" type="danger"
                                       @click="openAddressList()">
                                请选择
                            </el-button>
                            <el-button v-else type="primary" @click="openAddressList()">
                                查看
                            </el-button>
                        </template>

                    </template>
                </el-table-column>
                <el-table-column label="数量" prop="quantity" header-align="right" align="right">
                </el-table-column>
                <el-table-column label="成本(RMB)" prop="inTotalPrice" header-align="right" align="right">
                </el-table-column>
                <el-table-column label="收入(RMB)" prop="outTotalPrice" header-align="right" align="right">
                </el-table-column>
                <el-table-column label="利润(RMB)" prop="profit" header-align="right" align="right">
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
                <el-button @click="export2Excel" type="primary">导出地址</el-button>
            </template>
        </ec-page-item>
    </ec-page>
</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import Products from './products.vue';
    import billCommon from './billCommon.js';
    import AddressListDialog from './billAddressList.vue';
    import lodash from 'lodash';

    export default {
        mixins: [MessageMixin],
        components: {
            Products,
            AddressListDialog
        },
        data() {
            return {
                isEdit: false,
                bill: {
                    id: '',
                    docNo: '',
                    taxRate: '',
                    isClose: false,
                    customerList: []
                },
                billBak: {},
                // 获取row的key值
                getRowKeys(row) {
                    return row.id;
                },
                // 要展开的行，数值的元素是row的key值
                expands: [],
                lock: false,
                currentRow: {},
                showAddressListDialog: false,
            }
        },
        computed: {
            isLock() {
                return this.lock;
            }
        },
        mounted() {
            this.bill.id = this.$route.params.id;
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
                if (JSON.stringify(this.bill) != JSON.stringify(this.billBak)) {
                    this.doConfirm(() => {
                        this.isEdit = false;
                        this.bill = JSON.parse(JSON.stringify(this.billBak));
                    }, '数据没有保存，确认退出编辑？')
                } else {
                    this.isEdit = false;
                }
            },
            export2Excel() {
                const queryData = { id: this.bill.id };
                this.$http.get('api/address/export', { params: queryData })
                    .then(res => {
                        if (res.success) {
                            res.data.forEach(item => {
                                item.zeroCol = '';
                            });
                            require.ensure([], () => {
                                const { export_json_to_excel } = require('../../utils/ExportExcel');
                                const tHeader = ['订单编号', '收件人姓名（必填）', '收件人手机（二选一）', '收件人电话（二选一）', '收件人地址（必填）', '商品信息', '寄件人姓名', '寄件人手机（二选一）', '寄件人电话（二选一）', '寄件人地址'];
                                const filterVal = ['zeroCol', 'receiver', 'phone', 'zeroCol', 'deliveryAddress', 'zeroCol', 'zeroCol', 'zeroCol', 'zeroCol', 'zeroCol'];
                                const list = res.data;
                                const data = this.formatJson(filterVal, list);
                                export_json_to_excel(tHeader, data, '收件人信息');//自定义打印导入数据模板
                            })
                        } else {
                            this.$message({ message: res.msg, type: 'error' });
                        }
                    })

            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            fetchData() {
                const queryData = { id: this.bill.id };
                this.$http.get(`/api/bill/detail`, { params: queryData })
                    .then(res => {
                        if (res.success) {
                            this.bill = res.data;
                            if (this.bill.customerList.length === 0) {
                                this.bill.customerList.push(billCommon.initCustomer(this.bill.id));
                            }
                            this.billBak = JSON.parse(JSON.stringify(this.bill));
                        } else {
                            this.$message({ message: res.msg, type: 'error' });
                        }
                    });
            },
            addCustomer(index) {
                this.bill.customerList.push(billCommon.initCustomer(this.bill.id));
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
                this.currentRow = row;
                if ((!this.isEdit && colName !== '收货地址')
                    || ( colName !== '客户名称' && colName !== '收货地址' && colName !== '收款' && colName !== '操作')) {
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
            /**
             * 输入500毫秒后才开始查询数据
             querySearchAsync: lodash.debounce(function (key, cb) {
                if (key.trim() === '') {
                    this.currentRow.customerId = '';
                    cb([]);
                    return;
                }
                const queryData = {nickName: key.trim().toLowerCase()};
                this.$http.get(`/api/customer/search`, {params: queryData})
                    .then(res => {
                        if (res.success) {
                            billCommon.bindSearchKey(key, res.data, this.currentRow, true);
                            cb(res.data);
                        } else {
                            cb([]);
                        }
                    })
            }, 500),
             */
            querySearchAsync(key, cb) {
                if (key.trim() === '') {
                    this.currentRow.customerId = '';
                    cb([]);
                    return;
                }
                const queryData = { nickName: key.trim().toLowerCase() };
                this.$http.get(`/api/customer/search`, { params: queryData })
                    .then(res => {
                        if (res.success) {
                            billCommon.bindSearchKey(key, res.data, this.currentRow, true);
                            cb(res.data);
                        } else {
                            cb([]);
                        }
                    })
            },
            handleSelect(item) {
                this.currentRow.customerId = item.id;
                this.currentRow.isNewCustomer = false;
            },
            /**
             * 插入客户到后台
             */
            insertNewCustomer() {
                if (this.currentRow.isNewCustomer) {
                    const customer = {
                        id: this.currentRow.customerId,
                        nickName: this.currentRow.customerNickName
                    }
                    this.$http.post('api/customer/add', customer)
                        .then(res => {
                            if (res.success) {
                                this.currentRow.isNewCustomer = false;
                            } else {
                                this.resetCustomer();
                            }
                        })
                        .catch(() => {
                            this.resetCustomer();
                        })
                }
            },
            /**
             * 重置商品
             */
            resetCustomer() {
                this.currentRow.customerId = '';
                this.currentRow.customerNickName = '';
                this.$message({ message: '请重新输入客户名称', type: 'info' });
            },
            checkData() {
                for (let cIndex = 0; cIndex < this.bill.customerList.length; cIndex += 1) {
                    const customer = this.bill.customerList[cIndex];
                    //检查是否存在相同的客户
                    const findCustomers = this.bill.customerList.filter(cus => cus.customerId === customer.customerId);
                    if (findCustomers != undefined && findCustomers.length > 1) {
                        this.$message({ message: `存在相同的客户【${customer.customerNickName}】`, type: 'error' });
                        return false
                    }
                    //初始化默认值
                    for (let gIndex = 0; gIndex < customer.goodsList.length; gIndex += 1) {
                        let goods = customer.goodsList[gIndex];
                        goods.quantity = this.setDefaultData(goods.quantity, 1);
                        goods.inUnitPrice = this.setDefaultData(goods.inUnitPrice, 0);
                        goods.outUnitPrice = this.setDefaultData(goods.outUnitPrice, 0);
                        goods.inTotalPrice = this.setDefaultData(goods.inTotalPrice, 0);
                        goods.outTotalPrice = this.setDefaultData(goods.outTotalPrice, 0);
                        goods.profit = this.setDefaultData(goods.profit, 0);
                    }
                }
                return true;
            },
            setDefaultData(value, defaultValue) {
                if (value === null || value === '') {
                    return defaultValue;
                } else {
                    return value;
                }
            },
            saveBill() {
                if (!this.checkData()) return;
                this.lock = true;
                this.$http.post('/api/bill/save', this.bill)
                    .then(res => {
                        if (res.success) {
                            this.saveSuccess();
                            this.$message({ message: '保存成功', type: 'success' });
                        } else {
                            this.$message({ message: res.msg, type: 'error' });
                        }
                        this.lock = false;
                    })
                    .catch(e => {
                        this.lock = false;
                    });

            },
            deleteCustomer(index) {
                if (this.bill.customerList.length === 1) {
                    this.$message({ message: '必须保留一个客户', type: 'warning' });
                    return;
                }
                const customer = this.bill.customerList[index];
                if (customer.isAdd) {
                    this.doConfirm(() => {
                        this.bill.customerList.splice(index, 1);
                    }, `确定删除客户【${customer.customerNickName}】?`)
                } else {
                    this.doConfirm(() => {
                        this.$http.delete(`api/billCustomer/${customer.id}`)
                            .then(res => {
                                if (res.success) {
                                    this.bill.customerList.splice(index, 1);
                                    this.deleteCustomerEvent(index);
                                } else {
                                    this.$message({ message: res.msg, type: 'error' });
                                }
                            })
                    }, `确定删除客户【${customer.customerNickName}】?`)
                }

            },
            saveSuccess() {
                this.bill.customerList.forEach(customer => {
                    customer.isAdd = false;
                    customer.isNewCustomer = false;
                    customer.goodsList.forEach(goods => {
                        goods.isAdd = false;
                        goods.isNewGoods = false;
                    })
                })
                this.billBak = JSON.parse(JSON.stringify(this.bill));
            },
            deleteCustomerEvent(index) {
                this.billBak.customerList.splice(index, 1);
            },
            deleteGoodsEvent(billCustomerId, billGoodsId) {
                const billCustomerIndex = this.billBak.customerList.findIndex(customer => customer.id === billCustomerId);
                const newGoodsList = this.billBak.customerList[billCustomerIndex].goodsList.filter(goods => goods.id !== billGoodsId);
                this.billBak.customerList[billCustomerIndex].goodsList = newGoodsList;
                console.log(this.billBak);
            },
            openAddressList(row) {
                this.showAddressListDialog = true;
            }
        }
    }
</script>

<style>
</style>
