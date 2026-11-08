import { useUserStore } from '@/stores/useUserStore';
import type { MenuItem } from '../types/general';
import { useProfileStore } from '@/stores/useProfileStore';

export function menuItems(): MenuItem[] {
  const userStore = useUserStore();
  const profileStore = useProfileStore();

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
      route: '/pantry',
      name: 'general.pageTitles.pantry',
      condition: userStore.isLoggedIn && profileStore.profile?.use_pantry
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
