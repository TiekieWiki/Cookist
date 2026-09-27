import { useUserStore } from '@/stores/useUserStore';
import type { MenuItem } from '../types/general';

export function menuItems(): MenuItem[] {
  const userStore = useUserStore();

  return [
    {
      route: '/',
      name: 'homePage.title'
    },
    {
      route: '/recipes',
      name: 'recipesPage.title'
    },
    {
      route: 'grocery-list',
      name: 'groceryListPage.title'
    },
    {
      route: '/profile',
      name: 'profilePage.title',
      condition: userStore.isLoggedIn
    },
    {
      route: '/login',
      name: 'loginPage.title',
      condition: !userStore.isLoggedIn
    }
  ];
}
