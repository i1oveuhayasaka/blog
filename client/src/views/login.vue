<template>
    <div class="login-panel">
        <n-card title="管理后台登陆">
            <n-form :model="admin" :rules="rules">
                <n-form-item label="账号" path="account">
                    <n-input v-model:value="admin.account" placeholder="账号" />
                </n-form-item>
                <n-form-item label="密码" path="password">
                    <n-input v-model:value="admin.password" type="password" placeholder="密码" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-checkbox v-model:checked="admin.rember" label="记住我" />
                <n-space>
                    <n-button @click="login">登陆</n-button>
                    <n-button @click="to_home">返回首页</n-button>
                </n-space>
            </template>
        </n-card>
    </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { adminstore } from "../stores/adminstore"

import { useRoute, useRouter } from "vue-router"
const route = useRoute()
const router = useRouter()

const adminStore = adminstore();

const axios = inject("axios")
const message = inject("message")

let rules = {
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, max: 16, message: '账号长度 3-16 字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 1, max: 16, message: '账号长度 1-16 字符', trigger: 'blur' }
    ]
}
let admin = reactive({
    account: localStorage.getItem("account") || '',
    password: localStorage.getItem("password") || '',
    rember: localStorage.getItem("rember") == "true" || false
})
const to_home=() => {router.push('/')}
const login = async () => {
    let result = await axios.post("/admin/login", {
        account: admin.account,
        password: admin.password
    });

    if (result.data.code == 200) {
        adminStore.id = result.data.data.id;
        adminStore.token = result.data.data.token;
        adminStore.account = result.data.data.account;

        if (admin.rember == true) {
            localStorage.setItem("account", admin.account)
            localStorage.setItem("password", admin.password)
            localStorage.setItem("rember", admin.rember)
        }
        message.info('登陆成功')
        router.push("/dashboard")

    }
    else message.error('登陆失败');

}
</script>

<style lang="scss"  scoped>
.login-panel {
    width: 500px;
    margin: 0 auto;
    margin-top: 300px;
}
</style>