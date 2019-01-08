//引入axios
import axios from 'axios'
import router from '../router/index'
import {MessageBox} from 'element-ui'

let cancel, promiseArr = {}
const CancelToken = axios.CancelToken
axios.defaults.withCredentials = true // 让ajax携带cookie
// 请求拦截器
axios.interceptors.request.use(config => {
    // console.log('请求头部：' + JSON.stringify(config))
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器即异常处理
axios.interceptors.response.use(response => {
    if(window.isTowAlertLogin && window.isTowAlertLogin === 2){
        window.isTowAlertLogin = 1
    }
    return response
}, err => {
    if(!getLoginStatus()){
        window.isTowAlertLogin = 2  // 设置window.isTowAlertLogin = 2， 防止重复提示 '会话过期，请重新登录!' 或在提示完 '会话过期，请重新登录!' 后禁止再提示其他错误。
        return Promise.resolve(err)
    }else {
        window.isTowAlertLogin = 1
    }
    if (err && err.response) {
        var isReturn = true
        if(err.response.status && err.response.status === 500 && err.response.data && err.response.data.message && err.response.data.message.indexOf('重新登录') >=0){ // 会话过期，重新登录
            isReturn = false
            MessageBox.confirm('会话过期，请重新登录!', '提示', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'warning',
                center: false
            }).then((confirmRes) => {
                if(confirmRes === 'confirm') {
                    StorageUtils.setItem(StorageUtils.storageKey.user_loginInfo, {isLogin: false})
                    router.push('/login');
                }
            })
        }
        if(!isReturn){
            StorageUtils.setItem(StorageUtils.storageKey.user_loginInfo, {isLogin: false})
            return isReturn
        }

        switch (err.response.status) {
            case 400:
                err.message = '错误请求'
                break;
            case 401:
                err.message = '未授权，请重新登录'
                break;
            case 403:
                err.message = '拒绝访问'
                break;
            case 404:
                err.message = '请求错误,未找到该资源'
                break;
            case 405:
                err.message = '请求方法未允许'
                break;
            case 408:
                err.message = '请求超时'
                break;
            case 500:
                err.message = '服务器端出错'
                break;
            case 501:
                err.message = '网络未实现'
                break;
            case 502:
                err.message = '网络错误'
                break;
            case 503:
                err.message = '服务不可用'
                break;
            case 504:
                err.message = '网络超时'
                break;
            case 505:
                err.message = 'http版本不支持该请求'
                break;
            default:
                err.message = '连接错误${err.response.status}'
        }
    } else {
        err.message = '连接到服务器失败'
    }
    return Promise.resolve(err)
})

// axios.defaults.baseURL = baseURL
// 设置默认请求头
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': 'http://localhost:7788'
}
axios.defaults.timeout = 10000

// 获取登录状态
var getLoginStatus = function (url) {
    var userInfo = StorageUtils.getItem(StorageUtils.storageKey.user_loginInfo)
    if (userInfo && userInfo.isLogin) {
        return true
    } else {
        return false
    }
}

export default {
    getBaseUrl: function (dataSource) {
        var baseURL = ''
        if (process.env.NODE_ENV === 'testing') { // 测试环境
            baseURL = ''
        } else if (process.env.NODE_ENV === 'development') { // 开发环境
            baseURL = ''
        } else if (process.env.NODE_ENV === 'production') { // 生产环境
            baseURL = ''
        }
        return baseURL
    },
    // get请求
    get (url,param, dataSource) {
        return new Promise((resolve,reject) => {
            axios({
                method: 'get',
                url: this.getBaseUrl(dataSource) + url,
                params: param ? param : {},
                headers: param && param.headers ? Object.assign({ 'Content-Type': 'application/json' }, param.headers) : {'Accept': 'application/json;charset=UTF-8', 'Content-Type': 'application/json'},
                cancelToken: new CancelToken(c => {
                    cancel = c
                })
            }).then(res => {
                if(!window.isTowAlertLogin || window.isTowAlertLogin !== 2){
                    resolve(res.data ? res.data : res)
                }
            }).catch(res => {
                if(!window.isTowAlertLogin || window.isTowAlertLogin !== 2){
                    reject(res.data ? res.data : res)
                }
            })
        })
    },
    // post请求
    post (url,param, dataSource) {
        return new Promise((resolve,reject) => {
            axios({
                method: 'post',
                url: this.getBaseUrl(dataSource) + url,
                data: param && param.data ? param.data : {},
                headers: param && param.headers ? Object.assign({ 'Content-Type': 'application/json' }, param.headers) : { 'Accept': 'application/json;charset=UTF-8', 'Content-Type': 'application/json'},
                cancelToken: new CancelToken(c => {
                    cancel = c
                })
            }).then(res => {
                if(!window.isTowAlertLogin || window.isTowAlertLogin !== 2){
                    resolve(res.data ? res.data : res)
                }
            }).catch(res => {
                if(!window.isTowAlertLogin || window.isTowAlertLogin !== 2){
                    reject(res.data ? res.data : res)
                }
            })
        })
    },

    // put请求
    put (url,param, dataSource) {
        return new Promise((resolve,reject) => {
            axios({
                method: 'put',
                url: this.getBaseUrl(dataSource) + url,
                data: param && param.data ? param.data : {},
                headers: param && param.headers ? Object.assign({ 'Content-Type': 'application/json' }, param.headers) : { 'Accept': 'application/json;charset=UTF-8', 'Content-Type': 'application/json'},
                cancelToken: new CancelToken(c => {
                    cancel = c
                })
            }).then(res => {
                if(!window.isTowAlertLogin || window.isTowAlertLogin !== 2){
                    resolve(res.data ? res.data : res)
                }
            }).catch(res => {
                if(!window.isTowAlertLogin || window.isTowAlertLogin !== 2){
                    reject(res.data ? res.data : res)
                }
            })
        })
    }
}
