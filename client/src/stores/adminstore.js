import {defineStore} from 'pinia'
export const adminstore = defineStore('admin',{
    state:() => {
        return{
            id:0,
            account:'',
            token:''
        }
    },
    actions:{},
    getters:{}
})