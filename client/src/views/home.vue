<template>
    <div class="container">
        <div class="nav">
            <div @click="tohome">首页</div>
            <n-popselect @update:value="searchbycate" v-model:value="category_value" :options="category_options" scrollable>
                <div>分类<span><span v-if="category_name">:</span>{{ category_name }}</span></div>
            </n-popselect>
            <div @click="todashboard">后台</div>
        </div>
        <hr>
        <n-space style="margin-bottom: 10px;">
            <n-input @keyup.enter="search()" v-model:value="pageinfo.keyword" style="width:500px"
                placeholder="搜索文章"></n-input>
            <n-button type="primary" ghost @click="loadblog(0)">搜索</n-button>
        </n-space>
        <div v-for="blog in bloglist">
            <n-card :title=blog.title style="margin-bottom: 15px;cursor: pointer;" @click="todetail(blog)">
                {{ blog.content }}
                <template #footer>
                    <n-space align="center">
                        <div style="margin-right: 50px;">发布时间: {{ blog.create_time }}</div>
                    </n-space>
                </template>
            </n-card>
        </div>
        <n-space>
            <n-pagination @update:page="loadblog" v-model:page="pageinfo.page"
                :page-count="pageinfo.pagecount"></n-pagination>
        </n-space>
        <hr>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, inject, reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
const axios = inject("axios")
let category_value = ref(0)
const route = useRoute()
const router = useRouter()
let category_options = ref([])
let bloglist = ref([])

let pageinfo = reactive({
    page: 1,
    pagesize: 3,
    pagecount: 0,
    blogcount: 0,
    keyword: '',
    category_id:0,
})
const search = () => {
    loadblog(0)
}
onMounted(() => {
    load_category()
    loadblog()
})
const loadblog = async (pg = 0) => {
    if (pg != 0) {
        pageinfo.page = pg
    }
    let res = await axios.get(`/blog/search?keyword=${pageinfo.keyword}&category_id=${pageinfo.category_id}&page=${pageinfo.page}&pagesize=${pageinfo.pagesize}`)
    let temp = res.data.data.rows;
    for (let row of temp) {
        row.content = row.content.substring(0, 50) + '...'
        let d = new Date(row.create_time);
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    bloglist.value = temp;
    pageinfo.blogcount = res.data.data.count;
    pageinfo.pagecount = Math.ceil(pageinfo.blogcount / pageinfo.pagesize);
}
let category_name = computed(() => {
    let a = category_options.value.find((option) => { return option.value == category_value.value })
    return a ? a.label : ''
})
const load_category = async () => {
    let res = await axios.get("/category/list")
    if (res.data.code == 200) {
        category_options.value = res.data.rows.map((item) => {
            return {
                label: item.name,
                value: item.id
            }
        })
    }
}
const searchbycate=(id) => {
    pageinfo.category_id=id
    loadblog()
}
const tohome = () => { router.push('/') ;loadblog()}
const todashboard = () => { router.push('/login') }
const todetail = (blog) => { router.push({ path: '/detail', query: { id: blog.id } }) }

</script>


<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
}

.nav {
    display: flex;
    font-size: 20px;
    padding-top: 20px;
    color: gray;

    div {
        cursor: pointer;
        margin-right: 20px;

        &:hover {
            color: chocolate;
        }

        span {
            font-size: 15px;
        }
    }
}
</style>