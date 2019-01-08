<template>
   <div class="my-content">
       <el-tabs>
           <el-tab-pane label="个人信息">
               <el-form ref="form" :model="form" label-width="140px">
                   <!--<el-form-item label="头像：">-->
                       <!--<el-upload-->
                           <!--class="avatar-uploader"-->
                           <!--action="/"-->
                           <!--:http-request="handleUploadPhoto"-->
                           <!--:before-upload="beforeAvatarUpload"-->
                           <!--:on-preview="handlePictureCardPreview"-->
                           <!--:show-file-list="false">-->
                           <!--<img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">-->
                           <!--<i v-else class="el-icon-plus"></i>-->
                           <!--&lt;!&ndash;<div class="el-upload__tip" slot="tip">只能上传jpg/png/gif/tiff/bmp/pcx/tga文件，且大小不超过1M</div>&ndash;&gt;-->
                       <!--</el-upload>-->
                   <!--</el-form-item>-->
                   <el-form-item label="账号：">
                       {{form.account}}
                   </el-form-item>
                   <el-form-item label="手机号：" prop="phone" :rules="{ required: true, message: '账号/手机号不能为空', trigger: 'blur'}">
                       <el-input v-model="form.phone" size="medium" class="input-small"></el-input>
                   </el-form-item>
                   <!--<el-form-item label="昵称：" prop="nickName" :rules="{ required: true, message: '昵称不能为空', trigger: 'blur'}">-->
                       <!--<el-input v-model="form.nickName" size="medium" class="input-small"></el-input>-->
                   <!--</el-form-item>-->
                   <el-form-item label="真实姓名：">
                       <el-input v-model="form.userName" size="medium" class="input-small"></el-input>
                   </el-form-item>
                   <el-form-item label="性别：">
                       <el-radio v-model="form.userGender" :label="1">男</el-radio>
                       <el-radio v-model="form.userGender" :label="2">女</el-radio>
                   </el-form-item>
                   <el-form-item label="归属公司：">
                       {{userInfo.userInfo && userInfo.userInfo.orgName ? userInfo.userInfo.orgName : userInfo.curOprGzhOrgName}}
                   </el-form-item>
                   <el-form-item label="归属部门：">
                       {{userInfo.userInfo && userInfo.userInfo.userDepartment ? userInfo.userInfo.userDepartment : ''}}
                   </el-form-item>
                   <!--<el-form-item label="个性签名：">-->
                       <!--<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="form.remark" class="input-large"></el-input>-->
                   <!--</el-form-item>-->
                   <el-form-item label="角色：" class="color-555">
                       {{roleName}}
                   </el-form-item>
                   <el-form-item label="注册时间：">
                       {{userInfo.userInfo && userInfo.userInfo.createdate ? userInfo.userInfo.createdate : ''}}
                   </el-form-item>
                   <el-form-item>
                       <el-button type="primary" :loading="editUserLoading"  @click="saveUser('form')">保存</el-button>
                   </el-form-item>
               </el-form>
           </el-tab-pane>
           <el-tab-pane label="修改密码">
               <el-form ref="pwdOjb" :model="pwdOjb" label-width="140px">
                   <el-form-item label="旧密码：" prop="oldPassword" :rules="{ required: true, message: '旧密码不能为空', trigger: 'blur'}">
                       <el-input type="password" v-model="pwdOjb.oldPassword" size="medium" class="input-small"></el-input>
                   </el-form-item>
                   <el-form-item label="新密码：" prop="newPassword" :rules="{ required: true, message: '新密码不能为空', trigger: 'blur'}">
                       <el-input type="password" v-model="pwdOjb.newPassword" size="medium" class="input-small"></el-input>
                   </el-form-item>
                   <el-form-item label="确认密码：" prop="reNewPassword" :rules="{ required: true, message: '确认密码不能为空', trigger: 'blur'}">
                       <el-input type="password" v-model="pwdOjb.reNewPassword" size="medium" class="input-small"></el-input>
                   </el-form-item>
                   <el-form-item>
                       <el-button type="primary" :loading="editPwdLoading" @click="editPwd('pwdOjb')">保存</el-button>
                   </el-form-item>
               </el-form>
           </el-tab-pane>
       </el-tabs>
   </div>
</template>
<script>
    import {uploadFile, editUserByMe, editPwd} from '../../../api/user/user-apis'
    import bus from '../../common/bus';
    import {ToolsUtils} from "../../../utils/ToolsUtils";

    var regMobile = /^1[3|4|5|8][0-9]\d{4,8}$/
    var regPhone = /0\d{2,3}-\d{7,8}/
    var regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    var regIDCard15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/
    var regIDCard18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    export default {
        name: 'my',
        data() {
            return {
                form: {
                    account: "", // 平台登录账号
                    phone: "",
                    password: "",
                    rePassword:"",
                    cardCode: "",
                    company: "",
                    companyId: "",
                    userName: "",
                    userDepartno: '', // 部门编号
                    userDepartment: '', // 部门名称
                    level: '',
                    logoUrl: "",
                    mail: "",
                    nickName: "",
                    openId: "",
                    orgId: "",
                    parentId: "",
                    registerTime: "",
                    remark: "",
                    roleList: [], // 角色
                    sessionKey: "",
                    showFoll: true,
                    adminState: 0,
                    userState: 1,
                    userCode: "",
                    userType: '',
                    userId: '',
                    updateUserId: '', // 修改人id
                    updateUserName: '', // 修改人姓名
                    userGender: 1, // 性别
                    birthday: '', // 生日日期
                    country: '', // 用户所在国家
                    province: '', // 用户所在省份
                    city: '', // 用户所在城市
                },
                pwdOjb:{
                    userId: '',
                    oldPassword: '',
                    newPassword: '',
                    reNewPassword: '',
                },
                uploadForm: new FormData(),   // 一个formdata
                photoLoading: false,
                editUserLoading: false,
                editPwdLoading: false,
                userInfo: {},
                roleName: ''
            }
        },
        mounted: function () {
            this.dealData()
        },
        methods: {
            dealData: function () {
                var userInfo = StorageUtils.getItem(StorageUtils.storageKey.user_loginInfo)
                this.userInfo = userInfo
                var roleName = ''
                if(userInfo.roleInfo){
                    userInfo.roleInfo.filter(function (row) {
                        if(row.roleName){
                            roleName += '、' + row.roleName
                        }
                    })
                    if(roleName){
                        roleName = roleName.substr(1, roleName.length)
                    }
                }
                this.roleName = roleName
                this.form = {
                    account: this.userInfo.userInfo && this.userInfo.userInfo.account ? this.userInfo.userInfo.account : '',
                    userId: this.userInfo.userInfo && this.userInfo.userInfo.userId ? this.userInfo.userInfo.userId : '',
                    phone: this.userInfo.userInfo && this.userInfo.userInfo.phone ? this.userInfo.userInfo.phone : '',
                    nickName: this.userInfo.userInfo && this.userInfo.userInfo.nickName ? this.userInfo.userInfo.nickName : '',
                    userDepartment: this.userInfo.userInfo && this.userInfo.userInfo.userDepartment ? this.userInfo.userInfo.userDepartment : '',
                    userName: this.userInfo.userInfo && this.userInfo.userInfo.userName ? this.userInfo.userInfo.userName : '',
                    cardCode: this.userInfo.userInfo && this.userInfo.userInfo.cardCode ? this.userInfo.userInfo.cardCode : '',
                    userState: 1,
                    mail: this.userInfo.userInfo && this.userInfo.userInfo.mail ? this.userInfo.userInfo.mail : '',
                    logoUrl: this.userInfo.userInfo && this.userInfo.userInfo.logoUrl ? this.userInfo.userInfo.logoUrl : '',
                    remark: this.userInfo.userInfo && this.userInfo.userInfo.remark ? this.userInfo.userInfo.remark : '',
                    userGender: this.userInfo.userInfo && this.userInfo.userInfo.userGender ? this.userInfo.userInfo.userGender : '',
                    birthday: this.userInfo.userInfo && this.userInfo.userInfo.birthday ? this.userInfo.userInfo.birthday : '',
                    country: this.userInfo.userInfo && this.userInfo.userInfo.country ? this.userInfo.userInfo.country : '',
                    province: this.userInfo.userInfo && this.userInfo.userInfo.province ? this.userInfo.userInfo.province : '',
                    city: this.userInfo.userInfo && this.userInfo.userInfo.city ? this.userInfo.userInfo.city : '',
                    adminState: this.userInfo.userInfo && this.userInfo.userInfo.adminState ? this.userInfo.userInfo.adminState : 0,
                }
            },
            saveUser: function (formName) {
                var _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.form.updateUserId = _this.userInfo.userInfo && _this.userInfo.userInfo.userId ? _this.userInfo.userInfo.userId : ''
                        _this.form.updateUserName = _this.userInfo.userInfo && _this.userInfo.userInfo.userName ? _this.userInfo.userInfo.userName :  _this.userInfo.userInfo.phone
                        _this.form.orgId = _this.userInfo.userInfo && _this.userInfo.userInfo.orgId ? _this.userInfo.userInfo.orgId : ''
                        var param ={
                            data: _this.form
                        }
                        editUserByMe(param).then((res) => {
                            _this.editUserLoading = false
                            if (res.status && res.dataJson && res.dataJson.user) {
                                res.dataJson.user.userId = res.dataJson.user.userId ? res.dataJson.user.userId : _this.form.userId
                                res.dataJson.user.phone = res.dataJson.user.phone ? res.dataJson.user.phone : _this.form.phone
                                _this.userInfo.userInfo = res.dataJson.user
                                StorageUtils.setItem(StorageUtils.storageKey.user_loginInfo, _this.userInfo) // 缓存用户信息
                                bus.$emit('userInfo', _this.userInfo);
                                _this.$message.success('修改用户信息成功')
                            } else {
                                _this.$message.error('修改用户信息失败：' + res.dataJson && res.dataJson.result ? res.dataJson.result : '')
                            }
                        }).catch((e) => {
                            _this.$message.error('修改用户信息失败：' + res.dataJson && res.dataJson.result ? res.dataJson.result : '')
                            _this.editUserLoading = false
                        })
                    } else {
                        return false;
                    }
                });
            },
            editPwd: function (formName) {
                var _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(_this.pwdOjb.newPassword != _this.pwdOjb.reNewPassword){
                            var str = '新密码和确认密码不一致！'
                            _this.$alert(str)
                            return false
                        }
                        _this.pwdOjb = {
                            account: _this.userInfo.userInfo.phone,
                            oldPassword: _this.pwdOjb.oldPassword.trim(),
                            newPassword: _this.pwdOjb.newPassword.trim(),
                            reNewPassword: _this.pwdOjb.reNewPassword.trim()
                        }
                        _this.editPwdLoading = true
                        var param ={
                           data: _this.pwdOjb
                        }
                        editPwd(param).then((res) => {
                            _this.editPwdLoading = false
                            if (res.status && res.dataJson && res.dataJson.rsult == '修改成功') {
                                _this.$confirm('修改密码成功，请重新登录！', '提示', {
                                    confirmButtonText: '确定',
                                    showCancelButton: false,
                                    type: 'success',
                                    center: false
                                }).then(() => {
                                    StorageUtils.setItem(StorageUtils.storageKey.user_loginInfo, {isLogin: false}) // 缓存用户信息
                                    _this.$router.push('/login')
                                })
                            } else {
                                _this.$alert('修改密码失败：' + res.dataJson && res.dataJson.rsult ? res.dataJson.rsult : '')
                            }
                        }).catch((e) => {
                            _this.editPwdLoading = false
                            _this.$alert('修改密码失败：' + res.dataJson && res.dataJson.rsult ? res.dataJson.rsult : '')
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handlePictureCardPreview(file) {
                this.dialogVisible = true;
            },
            // 图片上传
            handleUploadPhoto(file) {
                let _this = this
                _this.photoLoading = true
                uploadFile({data: this.uploadForm}).then((res) => {
                    _this.photoLoading = false
                    if (res.status && res.dataJson && res.dataJson.images) {
                        var iserror = false
                        for (var i = 0; i < res.dataJson.images.length; i++) {
                            if(!ToolsUtils.isJsonString(res.dataJson.images[i])){
                                _this.$message.error('上传图片失败!')
                                iserror = true
                                break
                            }else {
                                res.dataJson.images[i] = JSON.parse(res.dataJson.images[i])
                                _this.form.logoUrl = res.dataJson.images[i].url
                                break
                            }
                        }
                        if(iserror) return
                        _this.$message.success('上传图片成功')
                    } else {
                        _this.$message.error('上传图片失败：' + res.errorMsg ? res.errorMsg : '')
                    }
                }).catch((e) => {
                    _this.$message.error(e)
                    _this.photoLoading = false
                })
            },
            beforeAvatarUpload(file) {
                const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/gif') || (file.type === 'image/tiff') || (file.type === 'image/bmp') || (file.type === 'image/pcx') || (file.type === 'image/tga');
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isJPG) {
                    this.$alert('上传的图片只能是 jpg/png/gif/tiff/bmp/pcx/tga 格式。图片' + file.name + '不在指定图片格式范围内！');
                }
                if (!isLt1M) {
                    this.$alert('上传图片' + file.name + '的大小不能超过 1MB!');
                }
                if (isJPG && isLt1M) {
                    this.uploadForm.append('file', file)
                }
                return isJPG && isLt1M;
            },
        },
    }

</script>

<style rel="stylesheet/css" scoped>
    .my-content {
        background: #fff;
        padding: 10px 20px 20px 20px;
        min-height: 100%;
    }
    .avatar-uploader .avatar{
        background: no-repeat;
        width: 90px;
        height: 90px;
    }

    .el-form {
        margin-top: 20px;
    }
    .input-small {
        width: 250px;
    }

    .input-large {
        width: 350px;
    }
</style>

