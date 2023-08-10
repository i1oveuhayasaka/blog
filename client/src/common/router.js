import {createRouter,createWebHashHistory} from 'vue-router'

let routes=[
    {path:'/test', component:() => import('../views/test.vue')},
    {path:'/login', component:() => import('../views/login.vue')},
    {path:'/', component:() => import('../views/home.vue')},
    {path:'/detail', component:() => import('../views/detail.vue')},
    {path:'/dashboard',
     component:() => import('../views/dashboard/dashboard.vue'),
     children:[
        {
            path:'/dashboard/category',
            component:() => import('../views/dashboard/category.vue'),
        },
        {
            path:'/dashboard/article',
            component:() => import('../views/dashboard/article.vue'),
        },



     ]},
]

const router=createRouter({

    history:createWebHashHistory(),
    routes
})

export {router,routes}