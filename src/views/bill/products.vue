<template>
    <el-table
            :data="goodsList" border :show-summary="false" :stripe="true"
            @row-click="rowClick"
            style="width: 100%">
        <el-table-column label="序号" type="index" width="50" header-align="center" align="center">
        </el-table-column>
        <el-table-column label="商品名称" header-align="center" align="center">
            <template scope="scope">
                <el-autocomplete v-if="isEdit"
                                 v-model="scope.row.goodsName"
                                 :fetch-suggestions="querySearchAsync"
                                 placeholder="请输入商品名称"
                                 @select="handleSelect"></el-autocomplete>
                <p v-else="">{{scope.row.goodsName}}</p>
            </template>
        </el-table-column>
        <el-table-column label="数量">
            <template scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.quantity" placeholder="请输入数量"
                          @change="changeQuantity(scope.$index)"></el-input>
                <p v-else="">{{scope.row.quantity}}</p>
            </template>
        </el-table-column>
        <el-table-column label="成本价">
            <template scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.inUnitPrice" placeholder="请输入成本价"
                          @change="changeInUnitPrice(scope.$index)"></el-input>
                <p v-else="">{{scope.row.inUnitPrice}}</p>
            </template>
        </el-table-column>
        <el-table-column label="币种" width="60" header-align="center" align="center">
            <template scope="scope">
                <el-button :disabled="!isEdit" :type="scope.row.isRMB ? 'danger' : 'primary'"
                           @click="changeCurrency(scope.$index,scope.row)">
                    {{scope.row.isRMB ? 'RMB' : 'HKD'}}
                </el-button>
            </template>
        </el-table-column>
        <el-table-column prop="outUnitPrice" label="卖出价(人民币)">
            <template scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.outUnitPrice" placeholder="请输入成本价"
                          @change="changeOutUnitPrice(scope.$index)"></el-input>
                <p v-else="">{{scope.row.outUnitPrice}}</p>
            </template>
        </el-table-column>
        <el-table-column prop="inTotalPrice" label="总成本(人民币)">
        </el-table-column>
        <el-table-column prop="outTotalPrice" label="总收入(人民币)">
        </el-table-column>
        <el-table-column prop="profit" sortable label="利润">
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
    import common from './billCommon.js';

    export default {
        components: {},
        name: 'childList',
        props: {
            isEdit: {
                type: Boolean,
                default: false
            },
            docNo: {
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
                this.goodsList.splice(index + 1, 0, common.initGoods(this.docNo, this.billCustomerId));
            },
            delGoods(index) {
                if (this.goodsList.length == 1) {
                    this.$message({ message: '必须保留一个商品', type: 'warning' });
                    return;
                }
                this.$http.delete(`api/billGoods/${this.goodsList[index].id}`)
                    .then(res => {
                        if (res.success) {
                            this.goodsList.splice(index, 1);
                            this.$emit('updateCustomer');
                        } else {
                            this.$message({ message: res.msg, type: 'error' });
                        }
                    })
            },
            rowClick(row, event, column){
                this.currentRow = row;
            },
            querySearchAsync(key, cb) {
                if (key.trim() === '') {
                    cb([]);
                    return;
                }
                const queryData = { name: key.trim().toLowerCase() };
                this.$http.get(`/api/goods/search`, { params: queryData })
                    .then(res => {
                        if (res.success) {
                            cb(res.result);
                        } else {
                            cb([]);
                        }
                    })
            },
            handleSelect(item) {
                this.currentRow.goodsId = item.id;
                console.log(this.currentRow);
            },
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