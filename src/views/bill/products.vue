<template>
    <el-table
            :data="goodsList" border :show-summary="false" :stripe="true"
            @row-click="rowClick"
            style="width: 100%">
        <el-table-column label="序号" type="index" width="50" header-align="center" align="center">
        </el-table-column>
        <el-table-column label="商品名称" header-align="center" align="center" width="200">
            <template scope="scope">
                <el-autocomplete v-if="isEdit"
                                 v-model="scope.row.goodsName"
                                 :fetch-suggestions="querySearchAsync"
                                 placeholder="请输入商品名称"
                                 @select="handleSelect"
                                 @blur="insertNewGoods"></el-autocomplete>
                <p v-else="">{{scope.row.goodsName}}</p>
            </template>
        </el-table-column>
        <el-table-column label="数量" header-align="right" align="right">
            <template scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.quantity" placeholder="数量为1可不填"
                          @keyup.native="changeQuantity(scope.$index)"></el-input>
                <p v-else="">{{scope.row.quantity}}</p>
            </template>
        </el-table-column>
        <el-table-column label="成本价" header-align="right" align="right">
            <template scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.inUnitPrice" placeholder="请输入成本价"
                          @keyup.native="changeInUnitPrice(scope.$index)"></el-input>
                <p v-else="">{{scope.row.inUnitPrice}}</p>
            </template>
        </el-table-column>
        <el-table-column prop="outUnitPrice" label="卖出价(RMB)" header-align="right" align="right">
            <template scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.outUnitPrice" placeholder="请输入成本价"
                          @keyup.native="changeOutUnitPrice(scope.$index)"></el-input>
                <p v-else="">{{scope.row.outUnitPrice}}</p>
            </template>
        </el-table-column>
        <el-table-column label="币种" width="70" header-align="center" align="center">
            <template scope="scope">
                <el-button :disabled="!isEdit" :type="scope.row.isRMB ? 'danger' : 'primary'"
                           @click="changeCurrency(scope.$index,scope.row)">
                    {{scope.row.isRMB ? 'RMB' : 'HKD'}}
                </el-button>
            </template>
        </el-table-column>
        <el-table-column prop="inTotalPrice" label="总成本(RMB)" header-align="right" align="right">
        </el-table-column>
        <el-table-column prop="outTotalPrice" label="总收入(RMB)" header-align="right" align="right">
        </el-table-column>
        <el-table-column prop="profit" sortable label="利润" header-align="right" align="right">
        </el-table-column>
        <el-table-column label="操作" width="160" header-align="center" align="center">
            <template scope="scope" v-if="isEdit">
                <template v-if="isEdit">
                    <el-button type="text" @click="addGoods(scope.$index)">添加商品</el-button>
                    <el-button type="text" @click="delGoods(scope.$index, scope.row)">删除商品</el-button>
                </template>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import billCommon from './billCommon.js';
    import GuidGenerate from '../../utils/GuidGenerate.js';

    export default {
        components: {},
        name: 'childList',
        props: {
            isEdit: {
                type: Boolean,
                default: false
            },
            billId: {
                type: String
            },
            billCustomerId: {
                type: String
            },
            goodsList: {
                type: Array,
                default: []
            },
            taxRate: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                currentRow: {}
            };
        },
        computed: {},
        methods: {
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
            addGoods(index) {
                this.goodsList.splice(index + 1, 0, billCommon.initGoods(this.billId, this.billCustomerId));
            },
            delGoods(index) {
                if (this.goodsList.length == 1) {
                    this.$message({ message: '必须保留一个商品', type: 'warning' });
                    return;
                }
                const billGoodsId = this.goodsList[index].id;
                if (this.goodsList[index].isAdd) {
                    this.goodsList.splice(index, 1);
                } else {
                    var _this = this;
                    this.$http.delete(`api/billGoods/${billGoodsId}`)
                        .then(res => {
                            if (res.success) {
                                this.goodsList.splice(index, 1);
                                this.$emit('deleteGoodsEvent', _this.billCustomerId, billGoodsId);
                                this.$emit('updateCustomer');
                            } else {
                                this.$message({ message: res.msg, type: 'error' });
                            }
                        })
                }
            },
            rowClick(row, event, column) {
                this.currentRow = row;
                this.currentRow.isNewGoods = false;
            },

            querySearchAsync(key, cb) {
                if (key.trim() === '') {
                    this.currentRow.goodsId = '';
                    cb([]);
                    return;
                }
                const queryData = { name: key.trim().toLowerCase() };
                this.$http.get(`/api/goods/search`, { params: queryData })
                    .then(res => {
                        if (res.success) {
                            billCommon.bindSearchKey(key, res.data, this.currentRow, false);
                            cb(res.data);
                        } else {
                            cb([]);
                        }
                    })
            },
            handleSelect(item) {
                this.currentRow.goodsId = item.id;
            },
            /**
             * 插入商品到后台
             */
            insertNewGoods() {
                if (this.currentRow.isNewGoods) {
                    const goods = {
                        id: this.currentRow.goodsId,
                        name: this.currentRow.goodsName
                    }
                    this.$http.post('api/goods/add', goods)
                        .then(res => {
                            if (res.success) {
                                this.currentRow.isNewGoods = false;
                            } else {
                                this.resetGoods();
                            }
                        })
                        .catch(() => {
                            this.resetGoods();
                        })
                }
            },
            /**
             * 重置商品
             */
            resetGoods() {
                this.currentRow.goodsId = '';
                this.currentRow.goodsName = '';
                this.$message({ message: '请重新输入商品名称', type: 'info' });
            },
            /**
             * 改变币种类型
             * @param index
             * @param row
             */
            changeCurrency(index, row) {
                if (!row.isRMB) {
                    row.isRMB = true;
                } else {
                    row.isRMB = !row.isRMB;
                }
                this.changeQuantity(index);
            },
            changeQuantity(index) {
                this.calculateOutTotalPrice(index);
                this.calculateInTotalPrice(index);
                this.calculateProfit(index);
                this.$emit('updateCustomer');
            },
            changeInUnitPrice(index) {
                this.calculateInTotalPrice(index);
                this.calculateProfit(index);
                this.$emit('updateCustomer');
            },
            changeOutUnitPrice(index) {
                this.calculateOutTotalPrice(index);
                this.calculateProfit(index);
                this.$emit('updateCustomer');
            },
            calculateInTotalPrice(index) {
                const item = this.goodsList[index];
                if (item.isRMB) {
                    item.inTotalPrice = (item.inUnitPrice * item.quantity).toFixed(0);
                } else {
                    item.inTotalPrice = (item.inUnitPrice * item.quantity * this.taxRate).toFixed(0);
                }
            },
            calculateOutTotalPrice(index) {
                const item = this.goodsList[index];
                item.outTotalPrice = (item.outUnitPrice * item.quantity).toFixed(0);
            },
            calculateProfit(index) {
                const item = this.goodsList[index];
                item.profit = (item.outTotalPrice - item.inTotalPrice).toFixed(0);
            }
        }
    };
</script>