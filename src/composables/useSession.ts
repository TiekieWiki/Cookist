import { onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useRecipeStore } from '@/stores/useRecipeStore';
import { useRecipesStore } from '@/stores/useRecipesStore';
import { useGroceryListStore } from '@/stores/useGroceryListStore';
import { setSystemLanguage, setUserLanguage } from '@/utils/global/setLanguage';
import {
  clearInterfaceVariables,
  setColorScheme,
  setHandedness
} from '@/utils/global/setInterfaceVariables';

/**
 * Keeps the app in sync with the logged in user. Loads the profile after logging in, clears the
 * data of the previous user after logging out, and applies the profile's preferences whenever the
 * profile changes.
 */
export function useSession(): void {
  const userStore = useUserStore();
  const profileStore = useProfileStore();
  const recipeStore = useRecipeStore();
  const recipesStore = useRecipesStore();
  const groceryListStore = useGroceryListStore();

  watch(
    () => userStore.user?.id,
    async (userId, previousUserId) => {
      if (previousUserId) {
        profileStore.clearProfile();
        recipeStore.clearRecipe();
        recipesStore.clearRecipes();
        groceryListStore.clearGroceryList();
      }

      if (userId) {
        await profileStore.getProfile();
      }
    },
    { immediate: true }
  );

  watch(
    () => profileStore.profile,
    (profile) => {
      if (profile) {
        setUserLanguage(profile.language);
        setColorScheme(profile.colorscheme);
        setHandedness(profile.handedness);
      } else {
        setSystemLanguage();
        clearInterfaceVariables();
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    userStore.getUser();
  });
}
