<template>
    <div class="el-menu-demo" :class="[position ? 'el-menu-demo1' : '']">
        <div>关于我们 | 关于产品 | 联系我们</div>
        <div><span class="color-888">©2018</span> XXX软件 <span class="color-888">小程序 Version 1.0</span></div>
   </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        props: ['position'],
    }
</script>

<style rel="stylesheet/css" scoped>
    .el-menu-demo{
        padding: 0px 0;
        text-align: center;
        position: absolute;
        bottom: 20px;
        z-index: 99;
        left: 0;
        width: 100%;
        font-size: 12px;
        color: #666;
        background-color: rgba(0,0,0,0.001);
    }
    .el-menu-demo1{
        background: #f4f4f4;
        position: relative;
    }
    .el-menu-demo div{
        line-height: 18px;
    }
</style>

