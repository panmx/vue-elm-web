import {StorageUtils} from './StorageUtils'
import themeArray from './themeArray'
import config from '../../config';

export var ToolsUtils = {
    staticPath: process.env.NODE_ENV !== 'development' ?  config.build.assetsSubDirectory: config.dev.assetsSubDirectory, // 静态资源路径
    /**
     * 获取路径参数
     */
    getUrlParam: function (url) {
        var theRequest = new Object();
        if (url.indexOf("?") != -1) { //获取url中"?"符后的字串
            var strArr = url.split('?');
            var strs = strArr[1].split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    treeObj: function(originObj) {
        //对象深拷贝
        let obj = {};
        obj = JSON.parse(JSON.stringify(originObj))
//                                for(var key in originObj) {
//                                    var val = originObj[key];
//                                    obj[key] = typeof val === 'object' ? arguments.callee(val) : val;
//                                }
        //对象新增children键值，用于存放子树
        obj['children'] = [];
        return obj;
    },
    /**
     * 将js数组转换成tree树形结构数组
     * @param data
     * @param attributes
     * @returns {Array}
     */
    toTreeData: function(data, attributes) {
        data.sort(function(a,b){ // 菜单排序
            return a.sort - b.sort;
        })
        let resData = data;
        let tree = [];

        //找寻根节点
        for(let i = 0; i < resData.length; i++) {
            if(resData[i][attributes.parentId] === '' || resData[i][attributes.parentId] === null) {
                tree.push(ToolsUtils.treeObj(resData[i]));
                resData.splice(i, 1);
                i--;
            }
        }

        //找寻子树
        var run = function(chiArr) {
            if(resData.length !== 0) {
                for(let i = 0; i < chiArr.length; i++) {
                    for(let j = 0; j < resData.length; j++) {
                        if(chiArr[i][attributes.id] === resData[j][attributes.parentId]) {
                            let obj = ToolsUtils.treeObj(resData[j]);
                            chiArr[i].children.push(obj);
                            resData.splice(j, 1);
                            j--;
                        }
                    }
                    run(chiArr[i].children);
                }
            }
        }

        run(tree);

        return tree;

    },
    /**
     *  判断是否有增删改查权限
     */
    checkPermission: function (url) {
        var permissionObj ={
            isSearchPermission: false,  // 是否有查询权限
            isAddPermission: false, // 是否有新增权限
            isEditPermission: false, // 是否有编辑权限
            isDeletePermission: false, // 是否有删除权限
        }

        let user = StorageUtils.getItem(StorageUtils.storageKey.user_loginInfo)
        if (user && user.userInfo && user.userInfo.adminState && user.userInfo.adminState === 1) { // 超级管理员拥有全部菜单的增删改查权限
            permissionObj ={
                isSearchPermission: true,  // 是否有查询权限
                isAddPermission: true, // 是否有新增权限
                isEditPermission: true, // 是否有编辑权限
                isDeletePermission: true, // 是否有删除权限
            }
            return permissionObj
        }

        var menuList = StorageUtils.getItem(StorageUtils.storageKey.user_menuList)
        url = url ? url.split('?')[0] : ''
        url = url.replace('/', '')
        var filterChilren = function (child) {
            for(var i=0; i<child.length; i++){
                if(child[i].menuUrl && url && url === child[i].menuUrl.replace('/', '')){
                    permissionObj.isSearchPermission = true
                    if(child[i].addAuthority){
                        permissionObj.isAddPermission = true
                    }
                    if(child[i].updateAuthority){
                        permissionObj.isEditPermission = true
                    }
                    if(child[i].deleteAuthority){
                        permissionObj.isDeletePermission = true
                    }
                    break
                } else if (child[i].children && child[i].children.length) {
                    filterChilren(child[i].children)
                }
            }
        }
        if (menuList && menuList.length) {
            for (var a = 0; a < menuList.length; a++) {
                if (menuList[a].menuUrl && url && url === menuList[a].menuUrl.replace('/', '')) {
                    permissionObj.isSearchPermission = true
                    if (menuList[a].addAuthority) {
                        permissionObj.isAddPermission = true
                    }
                    if (menuList[a].updateAuthority) {
                        permissionObj.isEditPermission = true
                    }
                    if (menuList[a].deleteAuthority) {
                        permissionObj.isDeletePermission = true
                    }
                    break
                } else if (menuList[a].children && menuList[a].children.length) {
                    filterChilren(menuList[a].children)
                }
            }
        }
        return permissionObj
    },
    // 文件流转BinaryString
    fixdata(data) {
        var o = "",
            l = 0,
            w = 10240;
        for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    },
    // 判断是否为json字符串
    isJsonString: function(str) {
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch(e) {
        }
        return false;
    },
    /**
     * 切换主题函数
     */
    changeTheme: function(themeValue){
        if(!themeValue){
            themeValue = localStorage.getItem("themeValue")
            themeValue = themeValue ? themeValue : 'theme-red' // 缓存主题色为空，默认为红色主题
        }
        // console.log('切换主题颜色值：',themeValue,this.staticPath,JSON.stringify(themeArray) );
        //需要移到单独的文件存放
        var cssArray = themeArray;

        var theme = themeValue === 'theme-red' || themeValue === 'theme-dark' ? 'theme-blue' : themeValue // 红色，黑色主题默认用蓝色主题的颜色

        var themeCss = this.staticPath + '/css/'+ theme + '/' + 'index.css';
        loadCss(themeCss)
        // for (let i = 0 ,len = cssArray.length; i < len; i++) {
        //     let itemPath = this.staticPath + '/css/'+ theme + '/' + cssArray[i].toLowerCase() + '.css';
        //     loadCss(itemPath)
        // }

        var mainCss = this.staticPath + '/css/main.css';
        loadCss(mainCss)

        var themeCss = this.staticPath + '/css/'+ themeValue + '/' + themeValue + '.css';
        loadCss(themeCss)

        localStorage.setItem("themeValue",themeValue)

        function loadCss(path){
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        }
    },
}
