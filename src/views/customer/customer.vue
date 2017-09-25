<template>
    <ec-container-item>
        <template slot="head">
            <el-form :inline="true" class="module-form">
                <el-form-item label="查找范围">
                    <el-input v-model="searchValue" @change="filterCustomers" icon="close" :on-icon-click="clearFilter"
                              placeholder="输入手机号/姓名" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="addCustomer">添加客户</el-button>
                    <el-button size="small" type="primary" @click="exportCustomer">导出收件人</el-button>
                    <el-button size="small" type="primary" @click="initCustomers">初始化客户</el-button>
                </el-form-item>
            </el-form>
        </template>

        <el-table :data="searchCustomers" highlight-current-row>
            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="80" sortable></el-table-column>
            <el-table-column prop="phone" label="手机号" width="100" sortable></el-table-column>
            <el-table-column prop="address" label="地址" sortable></el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="editCustomer(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteCustomer(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <customer-dialog :show.sync="showCustomerDialog" :isAdd="isAdd" :customer="customer"
                         @confirm="updateCustomer" @customerEvent="addNextCustomer"></customer-dialog>
        <router-view @refresh="refresh"></router-view>
    </ec-container-item>

</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import CommonMixin from '../../utils/CommonMixin.js';
    import storeCustomer from '../../utils/storeCustomer.js';
    import customerDialog from './customerDetail.vue';
    import Vue from 'vue';

    export default {
        mixins: [MessageMixin, CommonMixin],
        components: {
            customerDialog
        },
        data() {
            return {
                isAdd: false,
                searchCustomers: [],
                searchValue: '',
                customers: [],
                customer: {},
                showCustomerDialog: false
            }
        },
        mounted() {
            this.fetchCustomerList();
        },
        filters: {},
        methods: {
            refresh() {
                this.fetchCustomerList();
            },
            fetchCustomerList() {
                this.customers = storeCustomer.fetchCustomers();
                this.searchCustomers = this.customers;
            },
            clearFilter() {
                this.searchValue = '';
                this.filterCustomers();
            },
            addCustomer() {
                this.isAdd = true;
                this.customer = {
                    id: this.getRandom(),
                    name: '',
                    phone: '',
                    address: ''
                }
                this.showCustomerDialog = true;
            },
            editCustomer(customer) {
                this.isAdd = false;
                // 要给新的对象
                this.customer = JSON.parse(JSON.stringify(customer));
                this.showCustomerDialog = true;
            },
            deleteCustomer(index) {
                this.doConfirm(() => {
                    this.customers.splice(index, 1);
                    this.filterCustomers();
                    storeCustomer.saveCustomers(this.customers);
                }, `确定删除客户【${this.customers[index].name}】?`)
            },
            updateCustomer(isAdd) {
                if (isAdd) {
                    if (!this.customers) {
                        this.customers.push(this.getDeepObj(this.customer));
                    } else {
                        this.customers.splice(0, 0, this.getDeepObj(this.customer));
                    }
                } else {
                    let index = this.customers.findIndex(item => item.id === this.customer.id);
                    Vue.set(this.customers, index, this.customer);
                }
                this.filterCustomers();
                storeCustomer.saveCustomers(this.customers);
            },
            addNextCustomer(isAdd) {
                this.updateCustomer(isAdd);
                this.addCustomer();
            },
            filterCustomers() {
                this.searchCustomers = this.customers.filter((item) => {
                    return item.name.indexOf(this.searchValue) >= 0 || item.phone.indexOf(this.searchValue) >= 0
                });
            },
            exportCustomer() {
                this.$router.push({
                    name: 'customerExport',
                    params: {}
                })
            },
            initCustomers() {
//                this.customers.forEach(item => {
//                    item.id = this.getRandom();
//                })
                storeCustomer.initCustomers(this.customers);
            }
        }
    }

</script>

<style scoped>

</style>