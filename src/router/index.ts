import { createRouter, createWebHistory, type RouteLocation } from 'vue-router';
import Home from '../views/HomeView.vue';
import Recipes from '../views/RecipesView.vue';
import AddRecipe from '../views/AddRecipeView.vue';
import Login from '../views/LoginView.vue';
import NotFound from '../views/NotFoundView.vue';
import i18n from '@/i18n';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes = [
  {
    path: '/',
    name: i18n.global.t('homePage.title'),
    component: Home,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/recipes',
    name: i18n.global.t('recipesPage.title'),
    component: Recipes,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/add-recipe',
    name: i18n.global.t('addRecipePage.title'),
    component: AddRecipe,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: i18n.global.t('loginPage.title'),
    component: Login,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: i18n.global.t('notFoundPage.title'),
    component: NotFound,
    meta: {
      requiresAuth: false
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'active'
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
