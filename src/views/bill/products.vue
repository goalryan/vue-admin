<template>
    <el-table
            :data="products" border :show-summary="false" :stripe="true"
            style="width: 100%">
        <el-table-column label="序号" type="index" width="50" header-align="center" align="center">
        </el-table-column>
        <el-table-column label="商品名称">
            <template scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.name" size="small" placeholder="请输入商品名称"></el-input>
                <p v-else="">{{scope.row.name}}</p>
            </template>
        </el-table-column>
        <el-table-column label="数量">
            <template scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.quantity" size="small" placeholder="请输入数量"
                          @change="changeQuantity(scope.$index)"></el-input>
                <p v-else="">{{scope.row.quantity}}</p>
            </template>
        </el-table-column>
        <el-table-column label="成本价">
            <template scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.inUnitPrice" size="small" placeholder="请输入成本价"
                          @change="changeInUnitPrice(scope.$index)"></el-input>
                <p v-else="">{{scope.row.inUnitPrice}}</p>
            </template>
        </el-table-column>
        <el-table-column label="币种" width="60" header-align="center" align="center">
            <template scope="scope">
                <el-button :disabled="!isEdit" size="small" :type="scope.row.isRMB ? 'danger' : 'primary'"
                           @click="changeCurrency(scope.$index,scope.row)">
                    {{scope.row.isRMB ? 'RMB' : 'HKD'}}
                </el-button>
            </template>
        </el-table-column>
        <el-table-column prop="outUnitPrice" label="卖出价(人民币)">
            <template scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.outUnitPrice" size="small" placeholder="请输入成本价"
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
                <el-button size="small" type="text" @click="addProduct(scope.$index)">添加商品</el-button>
                <el-button size="small" type="text" @click="delProduct(scope.$index, scope.row)">删除商品</el-button>
            </template>
            <template v-else=""></template>
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
            products: {
                type: Array,
                default: []
            },
            taxRate: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {};
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
            addProduct(index){
                this.products.splice(index + 1, 0, common.initProduct());
            },
            delProduct(index){
                if (this.products.length == 1) {
                    // this.$message({message: '恭喜你，这是一条成功消息', type: 'success'});
                    this.$message({ message: '必须保留一个商品', type: 'warning' });
                    // this.$message({message: '恭喜你，这是一条成功消息', type: 'error'});
                    // this.$message({message: '恭喜你，这是一条成功消息'});
                } else {
                    this.products.splice(index, 1);
                    this.$emit('updateCustomer');
                }
            },
            changeCurrency(index, row) {
                if (!row.isRMB) {
                    row.isRMB = true;
                } else {
                    row.isRMB = !row.isRMB;
                }
                this.changeQuantity(index);
            },
            changeQuantity(index){
                this.calculateOutTotalPrice(index);
                this.calculateInTotalPrice(index);
                this.calculateProfit(index);
                this.$emit('updateCustomer');
            },
            changeInUnitPrice(index){
                this.calculateInTotalPrice(index);
                this.calculateProfit(index);
                this.$emit('updateCustomer');
            },
            changeOutUnitPrice(index){
                this.calculateOutTotalPrice(index);
                this.calculateProfit(index);
                this.$emit('updateCustomer');
            },
            calculateInTotalPrice(index){
                const item = this.products[index];
                if (item.isRMB) {
                    item.inTotalPrice = (item.inUnitPrice * item.quantity).toFixed(0);
                } else {
                    item.inTotalPrice = (item.inUnitPrice * item.quantity * this.taxRate).toFixed(0);
                }
            },
            calculateOutTotalPrice(index){
                const item = this.products[index];
                item.outTotalPrice = (item.outUnitPrice * item.quantity).toFixed(0);
            },
            calculateProfit(index){
                const item = this.products[index];
                item.profit = (item.outTotalPrice - item.inTotalPrice).toFixed(0);
            }
        }
    };
</script>