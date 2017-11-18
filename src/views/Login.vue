<template>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="userName">
            <el-input type="text" v-model="ruleForm.userName" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="display:flex;flex: 1;justify-content:flex-end;align-items: center">
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
                        {required: true, message: '请输入账号', trigger: 'blur,change'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur,change'}
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
                                const {data, success} = res;
                                if (success) {
                                    const token = `${data.token.token_type} ${data.token.access_token}`;
                                    sessionStorage.setItem("token", token);
                                    sessionStorage.setItem("enterpriseId", data.user.enterpriseId);
                                    sessionStorage.setItem("userName", data.user.userName);
                                    setTimeout(() => {
                                        this.$router.push({path: '/bill'});
                                    }, 500);

                                } else {
                                    this.$message({message: res.msg, type: 'error'});
                                }
                                this.logining = false;
                            })
                            .catch(e => {
                                this.logining = false;
                            });
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