import req from './../request'

// 消息中心-用户登录接口
export function login (data) {
    // data.headers = {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    // }
    // data.data = qs.stringify(data.data)
    return req.post('/xxx/login', data)
}

// 用户注册接口
export function register (data) {
    return req.post('xxx/register', data)
}

// 查询用户档案
export function findUserList (data) {
    return req.post('/xxx/queryUser?pageStart='+ data.data.pageStart + '&pageSize=' + data.data.pageSize + '&appId=' + data.data.appId, data)
}
// 查询用户详情
export function findUserDetail (data) {
    return req.post('/xxx/queryUserInfo', data)
}

// 添加用户信息
export function addUser (data) {
    return req.post('/xxx/addUserInfo', data)
}

// 修改用户信息
export function editUser (data) {
    return req.post('/xxx/updateAdminUserInfo', data)
}


// 修改个人信息
export function editUserByMe (data) {
    return req.post('/xxx/updateUserInfo', data)
}

// 修改密码
export function editPwd (data) {
    data.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    return req.post('/xxx/updatePassWord?account='+ data.data.account + '&oldPassword='+ data.data.oldPassword+ '&newPassword='+ data.data.newPassword, data)
}

// 图片上传接口
export function uploadFile (data) {
    data.headers = {
        'Content-Type': 'application/form-data'
    }
    return req.post('/xxx/uploadFile', data)
}

// 查获取关注用户openId
export function queryWXUserOpenId (data) {
    return req.get('/xxx/queryWXUserOpenId', data)
}

// 查询用户订阅
export function queryUserMsgtype (data) {
    return req.post('/xxx/queryMsgTypeByUser?orgId=' + data.data.orgId + '&userId=' + data.data.userId, data)
}

// 用户订阅消息类型
export function saveUserMsgtype (data) {
    return req.post('/xxx/saveUserMsgtype', data)
}

// 用户取消订阅消息类型
export function deleteUserMsgtype (data) {
    return req.post('/xxx/deleteUserMsgtype', data)
}

// 通过用户查找公司
export function queryCompanyByUser (data) {
    return req.post('/xxx/queryCompanyByUser', data)
}

// 用户订阅公司
export function saveUserCompany (data) {
    return req.post('/xxx/saveUserCompany', data)
}

// 用户取消订阅公司
export function deleteUserCompany (data) {
    return req.post('/xxx/deleteUserCompany', data)
}

// 查询用户对应仓店
export function queryDepotByUser (data) {
    return req.post('/xxx/queryDepotByUser', data)
}

// 用户关联店铺
export function saveUserDepot (data) {
    return req.post('/xxx/saveUserDepot', data)
}

// 用户取消关联店铺
export function deleteUserDepot (data) {
    return req.post('/xxx/delectUserDepot', data)
}
