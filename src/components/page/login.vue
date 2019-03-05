<template>
    <div class="login-content">
        <v-topnav showmenu="yes"></v-topnav>
        <img src="../../assets/login-backimg.png" class="login-body-style"/>
        <div @keyup.enter="login">
            <div class="login-back">
                <!--<div class="login-title">-->
                    <!--登录<span class="pull-right" @click="toPage('register')">没有帐号？立即注册</span>-->
                <!--</div>-->
                <div class="login-title text-align-center">
                    登&nbsp;&nbsp;录
                </div>
                <el-form ref="form" :model="form" label-width="85px">
                    <el-form-item>
                        <span slot="label" class="color-white"><label class="color-white">账号：</label></span>
                        <el-input class="input-samll" size="medium" v-model="form.account" placeholder="账号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span slot="label" class="color-white"><label class="color-white">密码：</label></span>
                        <el-input class="input-samll" size="medium" type="password" v-model="form.password" placeholder="密码" @keyup.enter="login"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-checkbox v-model="form.isSyncLogin" @keyup.enter="login">记住我</el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="medium" class="login-btn" @click="login" :loading="loading">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <v-bottomnav></v-bottomnav>
    </div>
</template>

<script>
    import vTopnav from '../common/Topnav'
    import vBottomnav from '../common/Bottomnav.vue'
    import {login} from '../../api/user/user-apis'
    import {AppContext} from '../../utils/AppContext'
    import moment from 'moment'

    export default {
        name: 'login',
        data() {
            return {
                form: {
                    account: '123',
                    password: '123',
                    isSyncLogin: false,
                },
                encodeUser: {},
                loading: false
            }
        },
        components: {
            vTopnav,
            vBottomnav
        },
        mounted: function () {
            var encodeUser = StorageUtils.getItem(StorageUtils.storageKey.user_encodeUser)
            this.encodeUser = encodeUser ? encodeUser : {}
            if (this.encodeUser.account && this.encodeUser.password) {
                var b = new AppContext.Base64()
                var pwd = b.decode(this.encodeUser.password)
                var user = {
                    account: this.encodeUser.account,
                    password: pwd,
                    isSyncLogin: this.encodeUser.isSyncLogin ? this.encodeUser.isSyncLogin : false
                }
                this.form = user
            }
        },
        methods: {
            login: function () {
                var userInfo = {"userInfo":{"wxUserId":null,"userId":"123456","userCode":"","orgId":"789","orgName":null,"userName":"路人甲","phone":"1591441xxxx","userDepartno":null,"userDepartment":"技术部","userState":1,"userGender":2,"createdate":"2018-11-23 16:14:42.0","updateUserName":"路人甲","updateDate":"2018-12-10 17:27:00.0","account":"123","password":null,"adminState":1,"search":null,"roleList":[]},"roleInfo":[{"id":"10001","orgId":"789","roleCode":"X001","roleName":"管理员","description":"管理员","state":1,"roleType":2,"appId":null,"appType":0,"menusDto":[]}]}
                userInfo.isLogin = true
                StorageUtils.setItem(StorageUtils.storageKey.user_loginInfo, userInfo)
                this.$router.push('/dashboard')
                return;

                var strErr = ''
                if(!this.form.account.trim()){
                    strErr = '、用户名'
                }
                if(!this.form.password.trim()){
                    strErr += '、密码'
                }
                if(strErr){
                    strErr = strErr.substr(1,strErr.length)
                    strErr += '不能为空！'
                    this.$confirm(strErr, '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'warning',
                        center: false
                    })
                    return false
                }
                var _this = this
                _this.loading = true
                login({data: _this.form}).then((res) => {
                    if(res.status && res.dataJson && res.dataJson.userInfo){
                        res.dataJson.isLogin = true
                        res.dataJson.userInfo.createdate =  res.dataJson.userInfo.createdate ? moment( res.dataJson.userInfo.createdate).format('YYYY-MM-DD HH:mm') : ''
                        StorageUtils.setItem(StorageUtils.storageKey.user_loginInfo, res.dataJson)
                        var b = new AppContext.Base64()
                        if (_this.form.isSyncLogin) {  // 自动登录，密码加密
                            var pwd = b.encode(_this.form.password)
                            var user = {
                                account: _this.form.account,
                                password: pwd,
                                isSyncLogin: _this.form.isSyncLogin
                            }
                            StorageUtils.setItem(StorageUtils.storageKey.user_encodeUser, user)
                        }else{
                            StorageUtils.setItem(StorageUtils.storageKey.user_encodeUser, '')
                        }
                        _this.$router.push('/dashboard')

                    }else{
                        var str = ''
                        if(res.errorMsg){
                            str = res.errorMsg
                        } else if(res.error){
                            str = res.error
                        }
                        if(str && str.indexOf('org.apache.shiro.ShiroException:') >= 0){
                            str = str.replace('org.apache.shiro.ShiroException:', '')
                        }
                        StorageUtils.setItem(StorageUtils.storageKey.user_loginInfo, {isLogin: false})
                        _this.$confirm('登录失败：' + str , '提示', {
                            confirmButtonText: '确定',
                            showCancelButton: false,
                            type: 'warning',
                            center: false
                        })
                    }
                    _this.loading = false
                }).catch((res) =>{
                    _this.loading = false
                    StorageUtils.setItem(StorageUtils.storageKey.user_loginInfo, {isLogin: false})
                    _this.$confirm('登录失败！', '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'warning',
                        center: false
                    })
                })
            },
            toPage: function (url) {
                this.$router.push(url)
            }
        }
    }
</script>

<style rel="stylesheet/css" scoped>
    body{overflow: hidden;}
    .login-content{
        overflow: auto;
    }
    .login-body-style {
        background-size: contain;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .login-back {
        width: 360px !important;
        height: 320px !important;
        background-color: rgba(255,255,255,1);
        border-radius: 6px !important;
        position: absolute;
        right: 250px;
        top: 50%;
        margin: -190px 0 0 0;
    }

    .login-title{
        color: #3783fa;
        font-size: 16px;
        padding: 20px 38px 10px 30px;
        border-bottom: 1px solid rgba(255,255,255,.2);
    }
    .el-form-item{
        margin-top: 15px;
    }
    .el-form-item label{
        color:#666;
    }
    .login-title span{
        font-size:14px;
        color: #f5f5f5;
    }
    .login-btn{
        margin-top: -28px;
        width:240px;
    }

    .input-samll{
        width: 240px;
    }
</style>
