<template>
    <ec-container-item>
        <template slot="head">
            <el-form :inline="true" class="module-form">
                <el-form-item label="查找范围">
                    <el-input v-model="searchValue" @change="filterAddress" icon="close" :on-icon-click="clearFilter"
                              placeholder="输入手机号/姓名/备注" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="addAddress">添加地址</el-button>
                    <el-button size="small" type="primary" @click="exportAddress">导出收件人</el-button>
                    <el-button size="small" type="primary" @click="initAddress">初始化客户</el-button>
                </el-form-item>
            </el-form>
        </template>

        <el-table :data="searchAddress" highlight-current-row>
            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="receiver" label="姓名" width="80" sortable></el-table-column>
            <el-table-column prop="phone" label="手机号" width="120" sortable></el-table-column>
            <el-table-column prop="memo" label="姓名" width="80"></el-table-column>
            <el-table-column prop="deliveryAddress" label="地址" sortable></el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="editAddress(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteAddress(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <address-dialog :show.sync="showAddressDialog" :isAdd="isAdd" :address="address"
                        @confirm="updateAddress" @addressEvent="addNextAddress"></address-dialog>
        <router-view @refresh="refresh"></router-view>
    </ec-container-item>

</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import CommonMixin from '../../utils/CommonMixin.js';
    import storeCustomer from '../../utils/storeCustomer.js';
    import addressDialog from './addressDetail.vue';
    import Vue from 'vue';

    export default {
        mixins: [MessageMixin, CommonMixin],
        components: {
            addressDialog
        },
        data() {
            return {
                isAdd: false,
                searchAddress: [],
                searchValue: '',
                addressList: [],
                address: {},
                showAddressDialog: false
            }
        },
        mounted() {
            this.fetchAddressList();
        },
        filters: {},
        methods: {
            refresh() {
                this.fetchAddressList();
            },
            fetchAddressList() {
                this.$http.get('/api/address')
                    .then(res => {
                        this.addressList = res.result.data;
                    });
                this.searchAddress = this.addressList;
            },
            clearFilter() {
                this.searchValue = '';
                this.filterAddress();
            },
            addAddress() {
                this.isAdd = true;
                this.address = {
                    receiver: '',
                    phone: '',
                    deliveryAddress: ''
                };
                this.showAddressDialog = true;
            },
            editAddress(address) {
                this.isAdd = false;
                // 要给新的对象
                this.address = JSON.parse(JSON.stringify(address));
                this.showAddressDialog = true;
            },
            deleteAddress(id) {
                let index = this.addressList.findIndex(item => item.id === id);
                this.doConfirm(() => {
                    this.addressList.splice(index, 1);
                    this.filterAddress();
                    storeCustomer.saveCustomers(this.addressList);
                }, `确定删除客户【${this.addressList[index].receiver}】?`)
            },
            updateAddress(isAdd) {
                if (isAdd) {
                    if (!this.addressList) {
                        this.addressList.push(this.getDeepObj(this.address));
                    } else {
                        this.addressList.splice(0, 0, this.getDeepObj(this.address));
                    }
                } else {
                    let index = this.addressList.findIndex(item => item.id === this.address.id);
                    Vue.set(this.addressList, index, this.address);
                }
                this.filterAddress();
                storeCustomer.saveCustomers(this.addressList);
            },
            addNextAddress(isAdd) {
                this.updateAddress(isAdd);
                this.addAddress();
            },
            filterAddress() {
                this.searchAddress = this.addressList.filter((item) => {
                    return item.receiver.indexOf(this.searchValue) >= 0
                        || item.phone.indexOf(this.searchValue) >= 0 || item.memo.indexOf(this.searchValue) >= 0
                });
            },
            exportAddress() {
                this.$router.push({
                    name: 'addressExport',
                    params: {}
                })
            },
            initAddress() {
                let inputData = [];
                let customers = storeCustomer.fetchCustomers();
                customers.forEach(item => {
                    inputData.push({
                        receiver: item.name,
                        phone: item.phone,
                        deliveryAddress: item.address
                    })
                });
                this.$http.post('/api/address/import', inputData)
                    .then(res => {
                        if (res.success) {
                            this.$message({ message: '保存成功', type: 'success' });
                        } else {
                            this.$message({ message: res.msg, type: 'error' });
                        }
                    })
            }
        }
    }

</script>

<style scoped>

</style>