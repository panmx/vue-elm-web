<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
    import {ToolsUtils} from "./utils/ToolsUtils";

    export default {
        name: 'App',
        data(){
            return { }
        },
        created(){
            ToolsUtils.changeTheme()
        },
        methods: { }
    }
</script>

<style rel="stylesheet/css">
    @import "./../static/fonts/iconfont/iconfont.css";
    @import "./../static/css/main.css";
</style>

