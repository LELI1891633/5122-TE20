import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/trends' },
    { path: '/trends', component: () => import('../views/Trends.vue') },
    { path: '/realtime', component: () => import('../views/RealTimeParking.vue') },
    { path: '/predictions', component: () => import('../views/Predictions.vue') },
    { path: '/settings', component: () => import('../views/Settings.vue') },
    { path: '/:pathMatch(.*)*', component: { template: '<p style="padding:16px">Not Found</p>' } },
  ],
})

export default router

