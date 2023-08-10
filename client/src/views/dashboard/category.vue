<template>
    <n-button   color="black" @click="showModal_add = true">添加分类</n-button>

    <n-table :bordered="false" :single-line="false">
        <thead>
            <tr>
                <th>分类编号（id）</th>
                <th>分类名称（name）</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="category in categorylist">
                <td>{{ category.id }}</td>
                <td>{{ category.name }}</td>
                <td>
                    <n-space>
                        <n-button @click="toupdate(category)">修改分类名称</n-button>
                        <n-button @click="deletecategory(category)">删除</n-button>
                    </n-space>
                </td>
            </tr>
        </tbody>
    </n-table>

    <n-modal v-model:show="showModal_add" preset="dialog" title="Dialog">
        <template #header>
            <div>添加分类</div>
        </template>
        <div>
            <n-input v-model:value="addcategory.name" type="text" placeholder="请输入分类名称"></n-input>
        </div>
        <template #action>
            <div>
                <n-button @click="add">确认</n-button>
            </div>
        </template>
    </n-modal>

    <n-modal v-model:show="showModal_update" preset="dialog" title="Dialog">
        <template #header>
            <div>修改分类名称</div>
        </template>
        <div>
            <n-input v-model:value="updatename.name" type="text" placeholder="请输入分类名称"></n-input>
        </div>
        <template #action>
            <div>
                <n-button @click="update">确认</n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup>
import { adminstore } from "../../stores/adminstore"
import { ref, reactive, inject, onMounted } from 'vue'
import { useRoute, useRouter } from "vue-router"
const route = useRoute()
const router = useRouter()
const adminStore = adminstore();
const axios = inject("axios")
const message = inject("message")
const dialog = inject("dialog")
const categorylist = ref([])
const showModal_add = ref(false)
const showModal_update = ref(false)
const addcategory = reactive({
    name: ""
})
const updatename = reactive({
    id: 0,
    name: ""
})
onMounted(() => {
    load_data()
})
const load_data = async () => {
    let res = await axios.get('/category/list')
    categorylist.value = res.data.rows;
}
const toupdate = (category) => {  //异步？
    showModal_update.value = true;
    updatename.id = category.id;
    updatename.name = category.name
}
//增
const add = async () => {
    let res = await axios.post('/category/_token/add', { name: addcategory.name });
    if (res.data.code == 200) {
        message.info(res.data.msg)
        load_data()
    }
    else {
        message.error(res.data.msg)
    }
    showModal.value = false;
}
//删
const deletecategory = async (category) => {
    dialog.warning({
        title: '警告',
        content: '确定删除此目录？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            let res = await axios.delete(`/category/_token/delete?id=${category.id}`);
            console.log(res);
            if (res.data.code == 200) {
                message.info(res.data.msg)
                load_data()
            }
            else {
                message.error(res.data.msg)
            }
        },
        onNegativeClick: () => { }
    })
}
//改
const update = async (category) => {
    let res = await axios.put('/category/_token/update', { id: updatename.id, name: updatename.name });
    if (res.data.code == 200) {
        message.info(res.data.msg)
        load_data()
    }
    else {
        message.error(res.data.msg)
    }
    showModal_update.value = false;
}
</script>


<style lang="scss" scoped></style>