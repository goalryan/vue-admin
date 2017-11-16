<template>
    <el-form :model="ruleForm" ref="ruleForm" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="userName" :rules="[ {required: true, message: '请输入账号', trigger: 'blur'}]">
            <el-input type="text" v-model="ruleForm.userName" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" :rules="[ {required: true, message: '请输入密码', trigger: 'blur'}]">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="display:flex;flex: 1;justify-content:space-between;align-items: center">
            <el-button type="primary" @click.native.prevent="handleSubmit('ruleForm')"
                       :loading="logining">登录
            </el-button>
            <el-button @click.native.prevent="handleReset">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import qs from 'qs';

    export default {
        data() {
            return {
                logining: false,
                ruleForm: {
                    userName: '',
                    password: ''
                },
                rules: {
                    userName: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ]
                },
                checked: true
            };
        },
        methods: {
            handleReset() {
                this.$refs.ruleForm.resetFields();
            },
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.logining) return;
                        this.logining = true;
                        this.$http.post('/api/user/login', this.ruleForm)
                            .then(res => {
                                if (res.success) {
                                    sessionStorage.setItem("token", res.data.access_token);
                                    localStorage.setItem("token", res.data.access_token);
                                    this.$router.push({path: '/bill'});
                                } else {
                                    this.$message({message: res.msg, type: 'error'});
                                }
                                this.logining = false;
                            })
                            .catch(e => {
                                this.logining = false;
                            });

                        const user = {
                            name: '刘绍俊',
                            avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png'
                        };
//                        sessionStorage.setItem('user', JSON.stringify(user));

                    }
                });

            },
            createUser() {
                const user = {
                    userName: '13510930357',
                    nickName: '霹雳闪电',
                    password: '123456'
                }
                this.$http.post('/api/user/add', user)
                    .then(res => {
                        console.log(res);
                    })
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;

        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }

        .remember {
            margin: 0px 0px 35px 0px;
        }

    }
</style>