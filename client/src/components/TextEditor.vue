<template>
    <div>
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />

        <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const editorRef = shallowRef();
const valueHtml = ref('');
const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
    server: 'http://localhost:3000/upload/rich_editor_upload',
    base64LimitSize: 10 * 1024,// 10kb
    fieldName: 'files',
}
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src) => {
        if (src.indexOf('http') !== 0) {
            return `http://localhost:3000${src}`
        }
        return src;
    }
}
const mode = ref("default");
let initfinish = false;
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue;
        initfinish = true;
    }, 10)
})
const emit = defineEmits(["update:model-value"])

onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});
// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
    if (initfinish) {
        emit('update:model-value', valueHtml.value);
    }
};

</script>


<style scoped></style>