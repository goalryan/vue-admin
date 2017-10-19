<template>
    <ec-container-item>
        <el-button type="small" @click="getAddress">Get</el-button>
        <el-button type="small" @click="addAddress">Add</el-button>
        <el-button type="small" @click="updateAddress">Update</el-button>
        <el-button type="small" @click="deleteAddress">Delete</el-button>
        <el-button type="small" @click="importAddress">Import</el-button>
        <ec-upload :multiple="false" @action="getAddress" @success="getData"></ec-upload>
    </ec-container-item>

</template>

<script>

    export default {
        data() {
            return {
                showImportDialog: false,
                Id: "d749fdcfbdb541168703cfec504b0302",
                objAdd: {
                    customerId: "111",
                    receiver: "张三",
                    phone: "123456789",
                    deliveryAddress: "深圳",
                    memo: "备注1"
                },
                objUpdate: {
                    Id: "d749fdcfbdb541168703cfec504b0302",
                    CustomerId: "222",
                    Receiver: "李四",
                    Phone: "987654321",
                    DeliveryAddress: "广州",
                    Memo: "备注2"
                }
            };
        },
        mounted() {

        },
        methods: {
            getAddress() {
                this.$http.get('/api/address')
                    .then((response => {
                        console.log(response);
                    }))
                    .catch((error) => {
                        console.log(error);
                    });
            },
            addAddress() {
                this.$http.post('/api/address/add', this.objAdd)
                    .then((response => {
                        console.log(response);
                    }))
                    .catch((error) => {
                        console.log(error);
                    });
            },
            updateAddress() {
                this.$http.put(`/api/address/${this.Id}`, this.objUpdate)
                    .then((response => {
                        console.log(response);
                    }))
                    .catch((error) => {
                        console.log(error);
                    });
            },
            deleteAddress() {
                this.$http.delete(`/api/address/${this.Id}`)
                    .then((response => {
                        console.log(response);
                    }))
                    .catch((error) => {
                        console.log(error);
                    });
            },
            importAddress() {
                const obj = [this.objAdd, this.objUpdate];
                this.$http.post('/api/address/import', obj)
                    .then((response => {
                        console.log(response);
                    }))
                    .catch((error) => {
                        console.log(error);
                    });
            },

            getData(val) {
                console.log(val);
            }

        }
    }

</script>