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
                    <el-button size="small" type="primary" @click="exportCustomer">导出收件人</el-button>
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
        <router-view @refresh="refresh"></router-view>
    </ec-container-item>

</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import storeCustomer from '../../utils/storeCustomer.js';
    export default {
        mixins: [MessageMixin],
        data() {

            return {
                customers: [],
                formInline: {
                    user: '',
                    region: ''
                }
            }
        },
        mounted(){
            this.fetchCustomerList();
        },
        methods: {
            refresh(){
                this.fetchCustomerList();
            },
            fetchCustomerList(){
                this.customers = storeCustomer.fetchCustomers();
                console.log(this.customers);
            },
            addCustomer(){

            },
            delAllBill(){
                this.doConfirm(() => {
                    store.delAllBill();
                });
            },
            search(){
            },
            exportCustomer(){
                this.$router.push({
                    name: 'customerExport',
                    params: {}
                })
            }
        }
    }

</script>

<style scoped>

</style>