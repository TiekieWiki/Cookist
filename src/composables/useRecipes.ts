import i18n from '@/i18n';
import { queryCookGroups } from '@/utils/cook group/getCookGroups';
import { getData } from '@/utils/global/db';
import { setImage } from '@/utils/global/manageImage';
import { getQueryRecipes } from '@/utils/recipe/queryRecipes';
import type { CookGroup, CookGroupRecipe } from '@/utils/types/cookgroup';
import type { Filter } from '@/utils/types/orderFilter';
import { RecipeCategories, type Recipe } from '@/utils/types/recipe';
import { getAuth } from 'firebase/auth';
import { onMounted, ref, watch, type Ref } from 'vue';

/**
 * Composable for managing recipes and cook groups.
 * @returns An object containing reactive references for cook groups, recipes, selected cook group, order, and filter.
 */
export function useRecipes(): {
  cookGroups: Ref<CookGroup[]>;
  currentCookGroupRecipes: Ref<CookGroupRecipe[]>;
  selectedCookGroup: Ref<string | undefined>;
  recipes: Ref<Recipe[]>;
  order: Ref<string>;
  filter: Ref<Filter>;
} {
  // Cook groups
  const cookGroups = ref<CookGroup[]>([]);
  const currentCookGroupRecipes = ref<CookGroupRecipe[]>([]);
  const selectedCookGroup = ref<string | undefined>();

  // Recipes
  const recipes = ref<Recipe[]>([]);
  const order = ref<string>('lastEatenAsc');
  const filter = ref<Filter>({
    name: '',
    categories: Object.values(RecipeCategories).map((category) => ({
      id: category,
      name: category,
      label: i18n.global.t(`editRecipePage.categories.${category}`),
      required: false,
      disabled: false,
      autocomplete: 'off',
      checked: false
    })),
    durationMin: 0,
    durationMax: 10080,
    ratingMin: 0,
    ratingMax: 5,
    lastEatenMin: new Date(0).toISOString().slice(0, 10),
    lastEatenMax: new Date('9999-12-31').toISOString().slice(0, 10),
    ingredients: [{ name: '' }]
  });

  // Get cook groups
  onMounted(async () => {
    getData('cookGroups', queryCookGroups(getAuth().currentUser?.uid || ''))
      .then((data) => {
        cookGroups.value = data as CookGroup[];

        if (cookGroups.value.length > 0) {
          // Get the personal cook group
          const personalCookGroup = cookGroups.value.find((group) => group.personal == true);
          if (personalCookGroup) {
            personalCookGroup.name = i18n.global.t('cookGroupsPage.personalCookGroup');
            selectedCookGroup.value = personalCookGroup?.id;
          }
        } else {
          selectedCookGroup.value = undefined;
        }
      })
      .catch((error) => {
        console.error('Error getting cook groups from database:', error);
      });
  });

  // Get recipes based on the selected cook group and filter
  watch(
    [selectedCookGroup, order, filter],
    async () => {
      getQueryRecipes(order.value, filter.value, selectedCookGroup.value || '')
        .then(async ({ cookGroupRecipes, recipeLastEatenOrder, recipeFilter }) => {
          currentCookGroupRecipes.value = cookGroupRecipes;

          if (currentCookGroupRecipes.value.length === 0) {
            recipes.value = [];
            return;
          }
          recipes.value = (await getData('recipes', recipeFilter)) as Recipe[];
          // Order the recipes by last eaten if provided
          if (recipeLastEatenOrder.length > 0) {
            recipes.value = recipeLastEatenOrder
              .map((recipeId: string) => recipes.value.find((recipe) => recipe.id === recipeId))
              .filter(Boolean) as Recipe[];
          }
          recipes.value.forEach((recipe_1) => {
            setImage(recipe_1.id, recipe_1.image);
          });
        })
        .catch((error) => {
          console.error('Error getting recipes based on filter:', error);
        });
    },
    { immediate: true, deep: true }
  );

  return {
    cookGroups,
    currentCookGroupRecipes,
    selectedCookGroup,
    recipes,
    order,
    filter
  };
}
