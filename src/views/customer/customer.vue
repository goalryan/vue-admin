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
                    <el-button size="small" type="primary" @click="importCustomer">导入历史收件人</el-button>
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
                    <el-button type="primary" size="small" @click="editCustomer(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteCustomer(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <customer-dialog :show.sync="showCustomerDialog" :isAdd="isAdd" :customer="customer"
                         @confirm="updateCustomer"></customer-dialog>
        <router-view @refresh="refresh"></router-view>
    </ec-container-item>

</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import CommonMixin from '../../utils/CommonMixin.js';
    import storeCustomer from '../../utils/storeCustomer.js';
    import customerDialog from './customerDetail.vue';

    export default {
        mixins: [MessageMixin, CommonMixin],
        components: {
            customerDialog
        },
        data() {
            return {
                isAdd: false,
                customers: [],
                customer: {},
                showCustomerDialog: false,
                formInline: {
                    user: '',
                    region: ''
                }
            }
        },
        mounted() {
            this.fetchCustomerList();
        },
        methods: {
            refresh() {
                this.fetchCustomerList();
            },
            fetchCustomerList() {
                this.customers = storeCustomer.fetchCustomers();
                console.log(this.customers);
            },
            search() {
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
                    storeCustomer.saveCustomers(this.customers);
                }, `确定删除客户【${this.customers[index].name}】?`)
            },
            updateCustomer(isAdd) {
                if (isAdd) {
                    this.customers.splice(0, 0, JSON.parse(JSON.stringify(this.customer)));
                } else {
                    let index = this.customers.findIndex(item => item.id = this.customer.id);
                    this.customers[index] = this.customer;
                }
                storeCustomer.saveCustomers(this.customers);
            },
            exportCustomer() {
                this.$router.push({
                    name: 'customerExport',
                    params: {}
                })
            },
            importCustomer() {
                this.customers.forEach(item => {
                    item.id = this.getRandom();
                })
                storeCustomer.initCustomers(this.customers);
            }
        }
    }

</script>

<style scoped>

</style>