<template>
    <ec-dialog :show.sync="showDialog" title="本次发货地址" @confirm="confirm"
               :showCancelButton="false" confirmTitle="关闭" width="600px">
        <el-form :inline="true" class="module-form" style="margin-left: 10px">
            <el-form-item>
                <el-button type="danger" @click="doNotSend">不发货</el-button>
                <el-button type="primary" @click="addAddress">添加地址</el-button>
                <el-button type="primary" @click="selectAddress">选择地址</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="addresses" height="250" @row-click="rowClick">
            <el-table-column label="选择" width="80" header-align="center" align="center">
                <template scope="scope">
                    <el-radio v-model="billCustomer.addressId" :label="scope.row.id">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="receiver" label="姓名" width="80"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="100"></el-table-column>
            <el-table-column prop="deliveryAddress" label="地址"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center" width="100">
                <template scope="scope">
                    <el-button type="text" @click="editAddress(scope.row)">修改</el-button>
                    <el-button type="text" @click="unBind(scope.row)">解绑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <addresses-view :show.sync="showAddressesDialog" @selectedAddressEvent="selectedAddressEvent"></addresses-view>
        <address-detail-view :show.sync="showAddressDetailDialog" :isAdd="isAdd" :id="addressId"
                             :customerId="billCustomer.customerId"
                             @confirm="confirmAddressDetail"></address-detail-view>
    </ec-dialog>
</template>


<script>
    import AddressesView from '../common/addressesView.vue';
    import AddressDetailView from '../common/addressDetailView.vue'

    export default {
        name: 'addresses',
        components: {
            AddressesView,
            AddressDetailView
        },
        props: {
            billCustomer: {
                type: Object,
                default: {}
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                addresses: [],
                showAddressesDialog: false,
                showAddressDetailDialog: false,
                isAdd: false,
                addressId: ''
            };
        },
        computed: {
            showDialog: {
                get() {
                    return this.show;
                },
                set(val) {
                    this.$emit('update:show', val);
                }
            }
        },
        watch: {
            show(val) {
                if (val) {
                    this.fetchData();
                } else {
                    this.addresses = [];
                }
            }
        },
        mounted() {
        },
        methods: {
            fetchData() {
                const queryData = { customerId: this.billCustomer.customerId };
                this.$http.get(`api/address/customerAddress`, { params: queryData }).then(res => {
                    if (res.success) {
                        this.addresses = res.data;
                    } else {
                        this.$message({ message: res.msg, type: 'error' });
                    }
                })
            },
            doSuccess() {
                this.showDialog = false;
                this.$emit('confirm', this.address);
            },
            addAddress(row) {
                this.isAdd = true;
                this.showAddressDetailDialog = true;
            },
            selectAddress() {
                this.showAddressesDialog = true;
            },
            selectedAddressEvent(address) {
                const result = this.addresses.find(item => item.id === address.id);
                // 没有才插入
                if (result === undefined) {
                    address.customerId = this.billCustomer.customerId;
                    this.$http.post('api/address/updateCustomerId', address)
                        .then(res => {
                            if (res.success) {
                                this.addresses.push(address);
                            }
                        })
                }

            },
            doNotSend() {
                const billCustomer = {
                    id: this.billCustomer.id,
                    addressId: ''
                }
                this.$http.post('api/billCustomer/updateAddressId', billCustomer)
                    .then(res => {
                        if (res.success) {
                            this.billCustomer.addressId = '';
                            this.showDialog = false;
                        }
                    })
            },
            editAddress(row) {
                this.isAdd = false;
                this.addressId = row.id;
                this.showAddressDetailDialog = true;
            },
            unBind(row) {
                row.customerId = '';
                this.$http.post('api/address/updateCustomerId', row)
                    .then(res => {
                        if (res.success) {
                            this.fetchData();
                        } else {
                            this.$message({ message: res.msg, type: 'error' });
                        }
                    })
            },
            rowClick(row, event, column) {
                if (column.label === '操作') return;
                const billCustomer = {
                    id: this.billCustomer.id,
                    addressId: row.id
                }
                this.$http.post('api/billCustomer/updateAddressId', billCustomer)
                    .then(res => {
                        if (res.success) {
                            this.billCustomer.addressId = row.id;
                            this.showDialog = false;
                        }
                    })
            },
            confirm() {
                this.showDialog = false;
            },
            confirmAddressDetail() {
                this.fetchData()
            }
        }
    };
</script>