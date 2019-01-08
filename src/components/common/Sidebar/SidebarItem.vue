<template>
    <div v-if="item">

        <template v-if="!item.children || (item.children && !item.children.length)">
            <a @click="toPage(item.menuUrl)">
                <el-menu-item :index="item.menuUrl" :key="item.menuUrl">
                    <i :class="item.menuIcon" class="font-size-18"></i><span slot="title">&nbsp;&nbsp;{{ item.name }}</span>
                </el-menu-item>
            </a>
        </template>

        <el-submenu v-else :index="item.name || item.menuUrl" :key="item.menuUrl">
            <template slot="title">
                <i :class="item.menuIcon" class="font-size-18"></i><span>&nbsp;&nbsp;{{ item.name }}</span>
            </template>

            <template v-for="child in item.children">
                <sidebar-item
                    v-if="child.children && child.children.length>0"
                    :is-nest="true"
                    :item="child"
                    :key="child.menuUrl"
                    class="nest-menu"/>

                <a v-else @click="toPage(child.menuUrl)">
                    <el-menu-item :index="child.menuUrl">
                        <i :class="child.menuIcon" class="font-size-18"></i><span slot="title">&nbsp;&nbsp;{{ child.name}}</span>
                    </el-menu-item>
                </a>
            </template>
        </el-submenu>

    </div>
</template>

<script>
    export default {
        name: 'SidebarItem',
        props: {
            // menu object
            item: {
                type: Object,
                required: true
            }
        },
        data() {
            return {}
        },
        methods: {
            toPage(url) {
                if (!url) {
                    return
                }
                if (url.trim().substr(0, 1) !== '/') {
                    url = '/' + url
                }
                this.$router.push(url)
            },
        }
    }
</script>
