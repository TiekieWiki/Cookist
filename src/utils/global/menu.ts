import { useUserStore } from '@/stores/useUserStore';
import type { MenuItem } from '../types/general';

export function menuItems(): MenuItem[] {
  const userStore = useUserStore();

  return [
    {
      route: '/',
      name: 'general.pageTitles.home'
    },
    {
      route: '/recipes',
      name: 'general.pageTitles.recipes',
      condition: userStore.isLoggedIn
    },
    {
      route: '/grocery-list',
      name: 'general.pageTitles.groceryList',
      condition: userStore.isLoggedIn
    },
    {
      route: '/profile',
      name: 'general.pageTitles.profile',
      condition: userStore.isLoggedIn
    },
    {
      route: '/login',
      name: 'general.pageTitles.login',
      condition: !userStore.isLoggedIn
    }
  ];
}
