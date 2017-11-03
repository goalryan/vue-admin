<template>
    <ec-dialog :show.sync="showDialog" title="getTitle" @confirm="confirm" @cancel="cancel"
               :showCancelButton="true" :showConfirmButton="true" width="400px">
        <el-table>

        </el-table>
    </ec-dialog>
</template>


<script>
    export default {
        name: 'AddressList',
        components: {},
        props: {
            id: {
                type: String,
                default: ''
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                address: this.initAddress()
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
                    //this.getData();
                }
            }
        },
        mounted() {
            if (!isAdd)
                this.fetchData();
        },
        methods: {
            fetchData(){
                this.$http.get(`api/address/${this.addressId}`).then(res => {
                    if (res.success) {
                        this.address = res.data;
                    } else {
                        this.$message({ message: res.msg, type: 'error' });
                    }
                })
            },
            initAddress(){
                return {
                    id: '',
                    customerId: '',
                    receiver: '',
                    phone: '',
                    deliveryAddress: '',
                }
            },
            addAddress(){
                this.$http.post(`api/address/add`, this.address).then(res => {
                    if (res.success) {
                        this.doSuccess();
                    } else {
                        this.$message({ message: res.msg, type: 'error' });
                    }
                })
            },
            updateAddress(){
                this.$http.post(`api/address/update`, this.address).then(res => {
                    if (res.success) {
                        this.doSuccess();
                    } else {
                        this.$message({ message: res.msg, type: 'error' });
                    }
                })
            },
            doSuccess(){
                this.showDialog = false;
                this.$emit('confirm', this.address);
            },
            confirm() {
                isAdd ? this.addAddress() : this.updateAddress();
            },
            cancel() {
                this.showDialog = false;
                this.address = this.initAddress();
            }
        }
    };
</script>