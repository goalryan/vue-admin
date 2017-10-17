<template>
    <ec-container-item>
        <el-button type="small" @click="importData"></el-button>
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
            importData(){
                this.$http.get('http://localhost:5000/api/receiveaddress')
                    .then((response => {
                        console.log(response);
                    }))
                    .catch((error) => {
                        console.log(error);
                    });
            },
            getData(val){
                console.log(val);
            }

        }
    }

</script>