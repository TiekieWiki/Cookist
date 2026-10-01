import {
  createRouter,
  createWebHistory,
  type RouteLocation,
  type RouteRecordRaw
} from 'vue-router';
import i18n, { loadTranslations, type TranslationNamespace } from '@/i18n/index';
import { supabase } from '@/utils/global/supabase.js';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean;
    title: string;
    translations: TranslationNamespace;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      requiresAuth: false,
      title: 'general.pageTitles.home',
      translations: 'home'
    }
  },
  {
    path: '/recipes',
    name: 'Recipes',
    component: () => import('../views/RecipesView.vue'),
    meta: {
      requiresAuth: true,
      title: 'general.pageTitles.recipes',
      translations: 'recipes'
    }
  },
  {
    path: '/recipe/:recipeId',
    name: 'Recipe',
    component: () => import('../views/RecipeView.vue'),
    meta: {
      requiresAuth: true,
      title: 'general.pageTitles.recipe',
      translations: 'recipe'
    }
  },
  {
    path: '/create-recipe/',
    name: 'Create Recipe',
    component: () => import('../views/EditRecipeView.vue'),
    meta: {
      requiresAuth: true,
      title: 'general.pageTitles.createRecipe',
      translations: 'editRecipe'
    }
  },
  {
    path: '/edit-recipe/:recipeId',
    name: 'Edit Recipe',
    component: () => import('../views/EditRecipeView.vue'),
    meta: {
      requiresAuth: true,
      title: 'general.pageTitles.editRecipe',
      translations: 'editRecipe'
    }
  },
  {
    path: '/grocery-list',
    name: 'Grocery List',
    component: () => import('../views/GroceryListView.vue'),
    meta: {
      requiresAuth: true,
      title: 'general.pageTitles.groceryList',
      translations: 'groceryList'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: 'general.pageTitles.profile',
      translations: 'profile'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      requiresAuth: false,
      title: 'general.pageTitles.login',
      translations: 'login'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      requiresAuth: false,
      title: 'general.pageTitles.notFound',
      translations: 'notFound'
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
  } else if (!to.meta.requiresAuth && data.session && to.name === 'Login') {
    return '/';
  }

  await loadTranslations(['general', to.meta.translations]);

  document.title = i18n.global.t(to.meta.title);

  return true;
});

export default router;
