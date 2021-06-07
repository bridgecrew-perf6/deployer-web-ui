import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/cd/home',
    },
    {
        path: '/cd',
        component: () => import('../components/Layout.vue'),
        children: [
            {path: 'home', component: () => import('../views/Home.vue')},
            {path: 'about', component: () => import('../views/About.vue')},
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
