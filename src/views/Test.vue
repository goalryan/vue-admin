<template>
    <ec-container-item>
        <el-button type="small" @click="importData">获取数据</el-button>
        <el-button type="small" @click="importAddress">导入数据</el-button>
        <ec-upload :multiple="false" @action="importData" @success="getData"></ec-upload>
    </ec-container-item>

</template>

<script>

    export default {
        data() {
            return {
                showImportDialog: false,
            };
        },
        mounted() {

        },
        methods: {
            importAddress() {
                const obj = {
                    Id: "123",
                    CustomerId: "sss",
                    Receiver: "ssfdfa",
                    Phone: "123",
                    DeliveryAddress: "深圳"
                }
                this.$http.post('/api/address', obj)
                    .then((response => {
                        console.log(response);
                    }))
                    .catch((error) => {
                        console.log(error);
                    });
            },
            importData() {
                this.$http.get('/api/address')
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