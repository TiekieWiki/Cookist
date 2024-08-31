import { createRouter, createWebHistory, type RouteLocation } from 'vue-router';
import i18n from '@/i18n';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes = [
  {
    path: '/',
    name: i18n.global.t('homePage.title'),
    component: () => import('../views/HomeView.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/recipes',
    name: i18n.global.t('recipesPage.title'),
    component: () => import('../views/RecipesView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/add-recipe',
    name: i18n.global.t('addRecipePage.title'),
    component: () => import('../views/AddRecipeView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/edit-recipe/:id',
    name: i18n.global.t('editRecipePage.title'),
    component: () => import('../views/EditRecipeView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: i18n.global.t('profilePage.title'),
    component: () => import('../views/ProfileView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: i18n.global.t('loginPage.title'),
    component: () => import('../views/LoginView.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: i18n.global.t('notFoundPage.title'),
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      requiresAuth: false
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    }
  }
});

/** Gets the current user
 * @returns Promise
 */
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to: RouteLocation, from: RouteLocation, next) => {
  //Check if route needs authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }

  //Set page title
  document.title = `${String(to.name)}`;
});

export default router;
