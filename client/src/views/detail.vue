<template>
    <div class="container">
        <n-button @click="tohome()" class="back">返回首页</n-button>
        <n-h1>{{ blog.title }}</n-h1>
        <hr>
        <div class="blog-content" >
            <div v-html="blog.content"></div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"
import { ref, reactive, inject, onMounted } from 'vue'
const route = useRoute()
const router = useRouter()
const axios = inject("axios")
let blog = ref({})
onMounted(() => {
    load()
})
const load = async () => {
    let res = await axios.get(`/blog/content?id=${route.query.id}`)
    blog.value = res.data.rows[0]
}
const tohome = () => { router.push('/') }
</script>


<style lang="scss" scoped>
.container {
    margin: 0 auto;
    width: 1200px;
}
.back{
    margin-top: 20px;
}
// :deep(img){max-width:100%}
</style>
<!-- <style>
.blog-content img{
max-width: 100% !important;
}
</style> -->