<template>
    <n-tabs v-model:value="tabname" justify-content="start" type="line">
        <n-tab-pane name="list" tab="文章">
            <div v-for="blog in bloglist">
                <n-card :title=blog.title style="margin-bottom: 15px;">
                    {{ blog.content }}
                    <template #footer>
                        <n-space align="center">
                            <div style="margin-right: 50px;">发布时间: {{ blog.create_time }}</div>
                            <n-button @click="toupdate(blog)">修改</n-button>
                            <n-button @click="todelete(blog)">删除</n-button>
                        </n-space>
                    </template>
                </n-card>
            </div>
            <n-space>
                <div>页数</div>
                <div v-for="pgnum in pageinfo.pagecount">
                    <div class="pg" @click="topage(pgnum)">{{ pgnum }}</div>
                </div>
            </n-space>
        </n-tab-pane>
        <n-tab-pane name="add" tab="添加文章">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="addarticle.title" placeholder="输入标题" />
                </n-form-item>

                <n-form-item label="分类">
                    <n-select v-model:value="addarticle.category_id" :options="categoryoptions" />
                </n-form-item>

                <n-form-item label="内容">
                    <texteditor v-model="addarticle.content"></texteditor>
                </n-form-item>

                <n-button @click="add">提交</n-button>
            </n-form>
        </n-tab-pane>
        <n-tab-pane name="xiugai" tab="修改文章">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="updatearticle.title" placeholder="输入标题" />
                </n-form-item>

                <n-form-item label="分类">
                    <n-select v-model:value="updatearticle.category_id" :options="categoryoptions" />
                </n-form-item>

                <n-form-item label="内容">
                    <texteditor v-model="updatearticle.content"></texteditor>
                </n-form-item>
                <n-button @click="update()">提交</n-button>
            </n-form>
        </n-tab-pane>
    </n-tabs>
    {{ addarticle.content }}
</template>

<script setup>
import { adminstore } from "../../stores/adminstore"
import { ref, reactive, inject, onMounted } from 'vue'
import { useRoute, useRouter } from "vue-router"
import texteditor from "../../components/TextEditor.vue"
const route = useRoute()
const router = useRouter()
const adminStore = adminstore();
const axios = inject("axios")
const message = inject("message")
const dialog = inject("dialog")
let keyword = ''
let tabname = ref('list')
let bloglist = ref([])
const addarticle = reactive({
    category_id: 0,
    title: '',
    content: ''
})
const updatearticle = reactive({
    id: 0,
    category_id: 0,
    title: '',
    content: ''
})
let categoryoptions = ref([])
let pageinfo = reactive({
    page: 1,
    pagesize: 3,
    pagecount: 0,
    blogcount: 0,
})
const topage = (pgnum) => {
    pageinfo.page = pgnum;
    loadblog()
}
onMounted(() => {
    loadcategory()
    loadblog()
})
const loadcategory = async () => {
    let res = await axios.get("/category/list")
    if (res.data.code == 200) {
        categoryoptions.value = res.data.rows.map((item) => {
            return {
                label: item.name,
                value: item.id
            }
        })
    }
}
const loadblog = async () => {
    let res = await axios.get(`/blog/search?page=${pageinfo.page}&pagesize=${pageinfo.pagesize}`)
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
const add = async () => {
    let res = await axios.post('/blog/_token/add', addarticle);
    if (res.data.code == 200) {
        message.info(res.data.msg)
    }
    else {
        message.error(res.data.msg)
    }
}
const toupdate = async (blog) => {
    tabname.value = 'xiugai'
    updatearticle.id = blog.id;
    updatearticle.title = blog.title;
    updatearticle.category_id = blog.category_id;
    let res = await axios.get(`/blog/content?id=${blog.id}`)
    updatearticle.content = res.data.rows[0].content;
}
const update = async () => {
    let res = await axios.put('/blog/_token/update', updatearticle);
    if (res.data.code == 200) {
        message.info(res.data.msg)
        loadblog()
        tabname.value='list'
    }
    else {
        message.error(res.data.msg)
    }
}
const todelete=async (blog) => {
    dialog.warning({
        title: '警告',
        content: '确定删除此文章？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            let res = await axios.delete(`/blog/_token/delete?id=${blog.id}`);
            console.log(res);
            if (res.data.code == 200) {
                message.info(res.data.msg)
                loadblog()
            }
            else {
                message.error(res.data.msg)
            }
        },
        onNegativeClick: () => { }
    })
}
</script>


<style lang="scss" scoped>
.pg {
    font-size: 15px;
    cursor: pointer;

    &:hover {
        color: cornflowerblue;
    }
}
</style>