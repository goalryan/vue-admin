<template>
    <ec-container-item>
        <template slot="head">
            <el-form :inline="true" :model="formInline" class="module-form">
                <el-form-item label="查找范围">
                    <el-input v-model="formInline.user" placeholder="输入手机号/姓名" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="search">查询</el-button>
                    <el-button size="small" type="primary" @click="addCustomer">添加客户</el-button>
                    <el-button size="small" type="primary" @click="addCustomer">导出收件人</el-button>
                </el-form-item>
            </el-form>
        </template>

        <el-table :data="customers" highlight-current-row>
            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="80" sortable></el-table-column>
            <el-table-column prop="phone" label="手机号" width="100" sortable></el-table-column>
            <el-table-column prop="address" label="地址" sortable></el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <ec-transfer
                filterable
                :filter-method="filterMethod"
                filter-placeholder="请输入城市拼音"
                v-model="value2"
                :data="data2">
        </ec-transfer>

        <router-view @refresh="refresh"></router-view>
    </ec-container-item>

</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import store from '../../utils/storeBill.js';
    export default {
        mixins: [MessageMixin],
        data() {
            const generateData2 = _ => {
                const data = [];
                const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
                const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
                cities.forEach((city, index) => {
                    data.push({
                        label: city,
                        key: index,
                        pinyin: pinyin[index]
                    });
                });
                return data;
            };
            return {
                customers: [
                    {
                        id: 1,
                        name: '张三',
                        phone: '13510930357',
                        address: '广东省深圳市南山区科技中二路软件园一期一栋401'
                    }
                ],
                formInline: {
                    user: '',
                    region: ''
                },
                data2: generateData2(),
                value2: [],
                filterMethod(query, item) {
                    return item.pinyin.indexOf(query) > -1;
                }
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
                this.customers = this.customers;
                console.log(this.customers);
            },
            addCustomer(){

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
            search(){
            }
        }
    }

</script>

<style scoped>

</style>