<template>
    <ec-container-item>
        <template slot="head">
            <el-form :inline="true" class="module-form">
                <el-form-item label="查找范围">
                    <el-input v-model="searchValue" @keyup.native="fetchData"
                              placeholder="输入手机号/姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchData">查询</el-button>
                    <el-button type="primary" @click="addAddress">添加地址</el-button>
                    <el-button type="primary" @click="exportAddress">导出收件人</el-button>
                </el-form-item>
            </el-form>
        </template>

        <el-table :data="addresses" highlight-current-row>
            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="receiver" label="姓名" width="80" sortable></el-table-column>
            <el-table-column prop="phone" label="手机号" width="120" sortable></el-table-column>
            <el-table-column prop="deliveryAddress" label="地址" sortable></el-table-column>
            <el-table-column prop="memo" label="备注" width="80"></el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template scope="scope">
                    <el-button type="primary" @click="editAddress(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="deleteAddress(scope.row.id)">删除</el-button>
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
                searchValue: '',
                addresses: [],
                address: {},
                showAddressDialog: false
            }
        },
        mounted() {

        },
        filters: {},
        methods: {
            refresh() {
                this.fetchData();
            },
            fetchData() {
                const queryData = {key: this.searchValue};
                this.$http.get(`api/address/searchUnBind`, {params: queryData}).then(res => {
                    if (res.success) {
                        this.addresses = res.data;
                    } else {
                        this.$message({message: res.msg, type: 'error'});
                    }
                })
            },
            addAddress() {
                this.isAdd = true;
                this.address = {
                    receiver: '',
                    phone: '',
                    deliveryAddress: '',
                    memo: ''
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
                let index = this.addresses.findIndex(item => item.id === id);
                this.doConfirm(() => {
                    this.$http.delete(`api/address/${id}`)
                        .then(res => {
                            if (res.success) {
                                this.addresses.splice(index, 1);
                            } else {
                                this.$message({message: res.msg, type: 'error'});
                            }
                        })

                }, `确定删除客户【${this.addresses[index].receiver}】?`)
            },
            updateAddress(isAdd) {
                if (isAdd) {
                    if (!this.addresses) {
                        this.addresses.push(this.getDeepObj(this.address));
                    } else {
                        this.addresses.splice(0, 0, this.getDeepObj(this.address));
                    }
                } else {
                    let index = this.addresses.findIndex(item => item.id === this.address.id);
                    Vue.set(this.addresses, index, this.address);
                }
            },
            addNextAddress(isAdd) {
                this.updateAddress(isAdd);
                this.addAddress();
            },
            exportAddress() {
                this.$router.push({
                    name: 'addressExport',
                    params: {}
                })
            }
        }
    }

</script>

<style scoped>

</style>