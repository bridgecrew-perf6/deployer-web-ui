import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/middle',
    },
    {
        path: '/middle',
        component: () => import('../views/Middle.vue'),
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/cd',
        component: () => import('../components/Layout.vue'),
        children: [
            {
                path: 'biz', component: () => import('../views/Biz.vue'),
            },
            {
                path: 'biz/deploy-template', component: () => import('../views/DeployTemplate.vue'),
            },
            {
                path: 'biz/deploy-list', component: () => import('../views/DeployList.vue'),
            },
            {
                path: 'biz/deploy-list/:appId/details', component: () => import('../views/DeployDetails.vue'),
            },
            // {
            //     path: 'biz/deploy-template/:appId',
            //     redirect: to => {
            //         return { path: '/cd/biz/deploy-template', query: {appId: to.params.appId} };
            //     },
            // },
            {path: 'about', component: () => import('../views/About.vue')},
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/NotFound.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
