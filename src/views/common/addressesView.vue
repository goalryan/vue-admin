<template>
    <ec-dialog :show.sync="showDialog" title="选择收货地址" @confirm="confirm"
               :showCancelButton="false" confirmTitle="关闭" width="700px">
        <el-form :inline="true" class="module-form">
            <el-form-item label="查找范围">
                <el-input v-model="searchValue" @keyup.native="fetchData" placeholder="输入手机号/姓名"
                          size="small"></el-input>
            </el-form-item>
        </el-form>
        <el-table :data="addresses" highlight-current-row height="350">
            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="receiver" label="姓名" width="80" sortable></el-table-column>
            <el-table-column prop="phone" label="手机号" width="120" sortable></el-table-column>
            <el-table-column prop="deliveryAddress" label="地址" sortable></el-table-column>
            <el-table-column label="操作" align="center" width="100">
                <template scope="scope">
                    <el-button type="primary" @click="selectAddress(scope.row)">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
    </ec-dialog>
</template>

<script>
    import vue from 'vue';

    export default {
        name: 'AddressView',
        components: {},
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                addresses: [],
                searchValue: ''
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
//                    this.fetchData();
                }
            }
        },
        methods: {
            fetchData() {
                if (this.searchValue === '') return;
                debugger;
                const queryData = {key: this.searchValue};
                this.$http.get(`api/address/searchUnBind`, {params: queryData}).then(res => {
                    if (res.success) {
                        this.addresses = res.data;
                    } else {
                        this.$message({message: res.msg, type: 'error'});
                    }
                })
            },
            selectAddress(row) {
                this.reset();
                this.$emit('selectedAddressEvent', row);
            },
            confirm() {
                this.reset();
            },
            reset() {
                this.showDialog = false;
                this.searchValue = '';
                this.addresses = [];
            }
        }
    };
</script>


