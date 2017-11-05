<template>
    <ec-dialog :show.sync="showDialog" title="本次发货地址" @confirm="confirm"
               :showCancelButton="false" confirmTitle="关闭" width="600px">
        <el-form :inline="true" class="module-form" style="margin-left: 10px">
            <el-form-item>
                <el-button type="danger" @click="clearBind">不发货</el-button>
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
        </el-table>
        <addresses-view :show.sync="showAddressesDialog" @selectedAddressEvent="selectedAddressEvent"></addresses-view>
    </ec-dialog>
</template>


<script>
    import AddressesView from '../common/addressesView.vue';

    export default {
        name: 'addresses',
        components: {
            AddressesView
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
                showAddressesDialog: false
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
                    this.fetchData()
                }
            }
        },
        mounted() {
        },
        methods: {
            fetchData() {
                const queryData = {customerId: this.billCustomer.customerId};
                this.$http.get(`api/address/customerAddress`, {params: queryData}).then(res => {
                    if (res.success) {
                        this.addresses = res.data;
                    } else {
                        this.$message({message: res.msg, type: 'error'});
                    }
                })
            },
            doSuccess() {
                this.showDialog = false;
                this.$emit('confirm', this.address);
            },
            addAddress() {

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
            clearBind() {
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
            rowClick(row, event, column) {
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
            }
        }
    };
</script>