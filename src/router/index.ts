import { createRouter, createWebHistory, type RouteLocation } from 'vue-router';
import i18n from '@/i18n/index';
import { supabase } from '@/utils/global/supabase.js';
import { ref } from 'vue';
import { Session } from '@supabase/auth-js';

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
    path: '/recipe/:recipeId',
    name: 'Recipe',
    component: () => import('../views/RecipeView.vue'),
    meta: {
      requiresAuth: true,
      title: 'recipePage.title'
    }
  },
  {
    path: '/edit-recipe/:recipeId?',
    name: 'Edit Recipe',
    component: () => import('../views/EditRecipeView.vue'),
    meta: {
      requiresAuth: true,
      title: 'editRecipePage.title'
    }
  },
  {
    path: '/grocery-list',
    name: 'Grocery List',
    component: () => import('../views/GroceryListView.vue'),
    meta: {
      requiresAuth: true,
      title: 'groceryListPage.title'
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
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: {
      requiresAuth: false,
      title: 'registerPage.title'
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

// Navigation guard to check if user is logged in
router.beforeEach(async (to: RouteLocation) => {
  const { data } = await supabase.auth.getSession();

  if (to.meta.requiresAuth && !data.session) {
    return '/login';
  }

  document.title = i18n.global.t(String(to.meta.title));

  return true;
});

export default router;
