<template>
    <div>
        <v-topnav showmenu="yes"></v-topnav>
        <img src="../../assets/login-backimg.png" class="login-body-style"/>
        <div>
            <div class="login-back">
                <div class="login-title">
                    注册<span class="pull-right" @click="toPage('login')">已有账号？现在登录</span>
                </div>
                <el-form ref="form" :model="form" label-width="110px">
                    <el-form-item>
                        <span slot="label" class="color-white"><label class="color-white">账号：</label></span>
                        <el-input class="input-samll" size="medium" v-model="form.phone" placeholder="用户名/手机号/邮箱"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span slot="label" class="color-white"><label class="color-white">密码：</label></span>
                        <el-input class="input-samll" size="medium" type="password" v-model="form.password" placeholder="密码" @keyup.enter="login"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span slot="label" class="color-white"><label class="color-white">确认密码：</label></span>
                        <el-input class="input-samll" size="medium" type="password" v-model="form.repassword" placeholder="确认密码" @keyup.enter="login"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="medium" class="login-btn" @click="register" :loading="loading">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <v-bottomnav></v-bottomnav>
        </div>
    </div>
</template>
<script>
    import vTopnav from '../common/Topnav'
    import vBottomnav from '../common/Bottomnav.vue'
    import {register} from '../../api/user/user-apis'

    export default {
        name: 'register',
        data() {
            return {
                form: {
                    phone: '',
                    password: '',
                    repassword: ''
                },
                loading: false
            }
        },
        components: {
            vTopnav,
            vBottomnav
        },
        methods: {
            register: function () {
                if(!this.doCheck()){
                    return false
                }
                var _this = this
                _this.loading = true
                register(this.form).then((res) => {
                    if(res.status && res.dataJson){
                        res.dataJson.isLogin = true

                    }else{
                        var obj = {
                            isLogin : false
                        }

                        _this.$alert(res.errorMsg ? res.errorMsg : '注册失败，账号或密码错误！')
                    }
                    _this.loading = false
                }).catch((res) =>{
                    _this.loading = false
                    var obj = {
                        isLogin : false
                    }
                    _this.$alert(res.errorMsg ? res.errorMsg : '注册失败！')
                })
            },
            doCheck: function () {
                var strErr = ''
                this.form = {
                    phone: this.form.phone.trim(),
                    password: this.form.password.trim(),
                    repassword: this.form.repassword.trim()
                }
                if(!this.form.phone){
                    strErr = '、用户名'
                }
                if(!this.form.password){
                    strErr += '、密码'
                }
                if(!this.form.repassword){
                    strErr += '、确认密码'
                }
                if(strErr){
                    strErr = strErr.substr(1,strErr.length)
                    strErr += '不能为空！'
                    this.$alert(strErr)
                    return false
                }else {
                    if(this.form.password != this.form.repassword){
                        strErr += '密码和确认密码不一致！'
                    }
                    if(strErr){
                        this.$alert(strErr)
                        return false
                    }else {
                        return true
                    }
                }
            },
            toPage: function (url) {
                this.$router.push(url)
            }
        }
    }
</script>
<style rel="stylesheet/css" scoped>
    body{overflow: hidden;}
    .login-body-style {
        background-size: contain;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
    }

    .login-back {
        width: 380px !important;
        height: 355px !important;
        background-color: rgba(0,0,0,0.2078);
        border-radius: 6px !important;
        position: absolute;
        right: 120px;
        top: 180px;
    }

    .login-title{
        color: #fff;
        font-size: 16px;
        padding: 20px 38px 10px 30px;
        border-bottom: 1px solid rgba(255,255,255,.2);
    }
    .el-form-item{
        margin-top: 28px;
    }

    .el-form-item label{
        color:#fff;
    }
    .el-form-item__label {
        color: #fff;
    }
    .login-title span{
        font-size:14px;
        color: #f5f5f5;
    }
    .login-btn{
        width: 230px;
    }

    .input-samll{
        width: 230px;
    }
</style>
