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

    export default {
        mixins: [MessageMixin],
        data() {
            return {
                customers: [],
                selectCustomers: [],
                exportCustomers: [],
                renderFunc(createElement, option) {
                    return createElement('div', [renderFirstRow(createElement, option), renderSecondRow(createElement, option)])
                },
                filterMethod(query, item) {
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
        created() {
            this.fetchCustomerList();
        },
        mounted() {

        },
        methods: {
            close() {
                this.$router.back();
            },
            fetchCustomerList() {
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
                this.selectCustomers.forEach(item => {
                    for (let i = 0; i < this.customers.length; i++) {
                        if (item === this.customers[i].id) {
                            this.customers[i].zeroCol = '';
                            this.exportCustomers.push(this.customers[i]);
                            break;
                        }
                    }
                });
                require.ensure([], () => {
                    const {export_json_to_excel} = require('../../utils/ExportExcel');
                    const tHeader = ['订单编号', '收件人姓名（必填）', '收件人手机（二选一）', '收件人电话（二选一）', '收件人地址（必填）', '商品信息', '寄件人姓名', '寄件人手机（二选一）', '寄件人电话（二选一）', '寄件人地址'];
                    const filterVal = ['zeroCol', 'name', 'phone', 'zeroCol', 'address', 'zeroCol', 'zeroCol', 'zeroCol', 'zeroCol', 'zeroCol'];
                    const list = this.exportCustomers;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '收件人信息');//自定义打印导入数据模板


                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>