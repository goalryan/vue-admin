<template>
    <ec-container>
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

            <el-table :data="addresses" highlight-current-row  class="ec-table">
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

            <address-detail-view :show.sync="showAddressDetailDialog" :isAdd="isAdd" :isCustomer="isAdd"
                                 :id="addressId" @confirm="confirmAddressDetail"></address-detail-view>

        </ec-container-item>
        <router-view @refresh="refresh"></router-view>
    </ec-container>
</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import CommonMixin from '../../utils/CommonMixin.js';
    import AddressDetailView from '../common/addressDetailView.vue'

    export default {
        mixins: [MessageMixin, CommonMixin],
        components: {
            AddressDetailView
        },
        data() {
            return {
                isAdd: false,
                searchValue: '',
                addresses: [],
                addressId: '',
                showAddressDetailDialog: false
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
                const queryData = { key: this.searchValue };
                this.$http.get(`api/address/search`, { params: queryData }).then(res => {
                    if (res.success) {
                        this.addresses = res.data;
                    } else {
                        this.$message({ message: res.msg, type: 'error' });
                    }
                })
            },
            addAddress() {
                this.isAdd = true;
                this.showAddressDetailDialog = true;
            },
            editAddress(row) {
                this.isAdd = false;
                this.addressId = row.id;
                this.showAddressDetailDialog = true;
            },
            deleteAddress(id) {
                let index = this.addresses.findIndex(item => item.id === id);
                this.doConfirm(() => {
                    this.$http.delete(`api/address/${id}`)
                        .then(res => {
                            if (res.success) {
                                this.addresses.splice(index, 1);
                            } else {
                                this.$message({ message: res.msg, type: 'error' });
                            }
                        })

                }, `确定删除客户【${this.addresses[index].receiver}】?`)
            },
            confirmAddressDetail() {
                this.$message({ message: '成功', type: 'success' });
                this.fetchData()
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