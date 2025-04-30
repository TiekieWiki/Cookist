import { createRouter, createWebHistory, type RouteLocation } from 'vue-router';
import i18n from '@/i18n/index';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      requiresAuth: false,
      title: 'homePage.title'
    }
  },
  {
    path: '/recipes',
    name: 'Recipes',
    component: () => import('../views/RecipesView.vue'),
    meta: {
      requiresAuth: true,
      title: 'recipesPage.title'
    }
  },
  {
    path: '/recipe/:cookGroupRecipeId',
    name: 'Recipe',
    component: () => import('../views/RecipeView.vue'),
    meta: {
      requiresAuth: true,
      title: 'recipePage.title'
    }
  },
  {
    path: '/edit-recipe/:cookGroupRecipeId?',
    name: 'Edit Recipe',
    component: () => import('../views/EditRecipeView.vue'),
    meta: {
      requiresAuth: true,
      title: 'editRecipePage.title'
    }
  },
  {
    path: '/cookgroups',
    name: 'Cook Groups',
    component: () => import('../views/CookGroupsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'cookGroupsPage.title'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: 'profilePage.title'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      requiresAuth: false,
      title: 'loginPage.title'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      requiresAuth: false,
      title: 'notFoundPage.title'
    }
  }
];

// Create the router instance
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

// Gets the current user
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

// Navigation guard to check if user is logged in
router.beforeEach(async (to: RouteLocation, from: RouteLocation, next) => {
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
  document.title = i18n.global.t(String(to.meta.title));
});

export default router;
