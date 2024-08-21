import { createRouter, createWebHistory, type RouteLocation } from 'vue-router';
import Home from '../views/HomeView.vue';
import i18n from '@/i18n';

const routes = [
  {
    path: '/',
    name: i18n.global.t('homePage.title'),
    component: Home
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'active'
});

router.beforeEach(async (to: RouteLocation, from: RouteLocation, next) => {
  //Check if route needs authentication
  // if (to.matched.some((record) => record.meta.requiresAuth)) {
  //   if (await getCurrentUser()) {
  //     next();
  //   } else {
  //     next("/login");
  //   }
  // } else {
  //   next();
  // }

  //Set page title
  document.title = `${String(to.name)}`;
});

export default router;
