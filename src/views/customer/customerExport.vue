<template>
    <ec-page @close="close" title="导出收件人">
        <ec-page-item>
            <el-transfer
                    v-model="selectCustomers"
                    filterable
                    :filter-method="filterMethod"
                    :left-default-checked="[]"
                    :right-default-checked="[]"
                    :render-content="renderFunc"
                    :titles="['Source', 'Target']"
                    :footer-format="{
                      noChecked: '${total}',
                      hasChecked: '${checked}/${total}'
                    }"
                    @change="handleChange"
                    :data="customers"
                    class="ec-transfer">
            </el-transfer>
        </ec-page-item>
        <ec-page-item slot="footer">
            <el-button @click="export2Excel" type="primary">导出</el-button>
        </ec-page-item>
    </ec-page>
</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import storeCustomer from '../../utils/storeCustomer.js';
    export default{
        mixins: [MessageMixin],
        data(){
            return {
                customers: [],
                selectCustomers: [],
                renderFunc(createElement, option) {
                    return createElement('div', [renderFirstRow(createElement, option), renderSecondRow(createElement, option)])
                },
                filterMethod(query, item){
                    let names = item.name.indexOf(query) > -1;
                    let phones = item.phone.indexOf(query) > -1;
                    return phones || names;
                }
            };
            function renderFirstRow(createElement, option) {
                return createElement('p', [renderNameCell(createElement, option), renderPhoneCell(createElement, option)])
            }

            function renderNameCell(createElement, option) {
                return createElement('h4', `${ option.name }`)
            }

            function renderPhoneCell(createElement, option) {
                return createElement('h6', `${ option.phone }`)
            }

            function renderSecondRow(createElement, option) {
                return createElement('h6', `${ option.address }`)
            }
        },
        created(){
            this.fetchCustomerList();
        },
        mounted() {

        },
        methods: {
            close(){
                this.$router.back();
            },
            fetchCustomerList(){
                this.customers = storeCustomer.fetchCustomers();
                this.customers.forEach(item => {
                    item.key = item.id;
                    item.label = item.name + item.phone + item.address;
                    item.disabled = false;
                })
                console.log(this.customers);
            },
            handleChange(value, direction, movedKeys) {
                console.log(value, direction, movedKeys);
            },
            export2Excel() {
                console.log(this.selectCustomers);
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../utils/ExportExcel');
                    const tHeader = ['序号', '姓名', '手机', '地址'];
                    const filterVal = ['id', 'name', 'phone', 'address'];
                    const list = this.customers;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '收件人信息');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>