<template>
    <div class="main-panel">
        <div class="menus">
            <div v-for="(menu) of menus" @click="topage(menu)">
                {{ menu.name }}
            </div>
        </div>
        <div class="router_view">
            <router-view></router-view>
        </div>
    </div>
    <div class="title">后台文章管理</div>
</template>

<script setup>
import { adminstore } from "../../stores/adminstore"
import { ref, reactive, inject } from 'vue'
import { useRoute, useRouter } from "vue-router"
const route = useRoute()
const router = useRouter()
const adminStore = adminstore();
const axios = inject("axios")
const message = inject("message")
let menus = [
    { name: "文章管理", href: '/dashboard/article' },
    { name: "分类管理", href: '/dashboard/category' },
    { name: "退出", href: 'logout' },
]
const topage = (menu) => {
    if (menu.name == '退出') {
        router.push('/login')
    }
    else{
        router.push(menu.href)
    }
}
</script>


<style lang="scss" scoped>
.main-panel {
    background-color: antiquewhite;
    display: flex;
    color: darkgray;
    max-width: 1800px;
    margin: 0 auto;
}

.menus {
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 200px;
    height: 95vh;
    border-right: 1px solid #dadada;

    div {
        cursor: pointer;

        &:hover {
            color: cornflowerblue;
        }
    }
}

.router_view {
    padding: 20px;
    width: 100%;
}

.title {
    font-size: 25px;
    font-weight: bold;
    text-align: right;
    position: fixed;
    color: rgba(0, 0, 0, 20%);
    right: calc((100vw - 1500px) / 2);
    bottom: 45px;
}</style>