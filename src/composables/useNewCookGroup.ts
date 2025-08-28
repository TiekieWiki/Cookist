import i18n from '@/i18n';
import { validateCookGroup } from '@/utils/cook group/validateCookGroup';
import { getData, updateData, addData, deleteData } from '@/utils/global/db';
import { setImage } from '@/utils/global/manageImage';
import { capitalizeFirstLetter } from '@/utils/global/text';
import { getSearchRecipes } from '@/utils/recipe/searchRecipe';
import { type CookGroup, emptyCookGroup, type CookGroupRecipe } from '@/utils/types/cookgroup';
import { emptyRecipe, type Recipe } from '@/utils/types/recipe';
import { getAuth } from 'firebase/auth';
import { where, Timestamp, and } from 'firebase/firestore';
import { ref, onMounted, capitalize, watch, type Ref } from 'vue';

/**
 * Composable for creating or editing a cook group
 * @returns {Object} An object containing the cook group data and methods
 */
export function useNewCookGroup(): {
  cookGroup: Ref<CookGroup>;
  recipes: Ref<Recipe[]>;
  errorMessage: Ref<string>;
  searchRecipeQuery: Ref<string>;
  filteredRecipes: Ref<Recipe[]>;
  addRecipe: (recipe: Recipe) => void;
  saveCookGroup: () => Promise<void>;
  closePopUp: () => void;
} {
  const props = defineProps<{
    cookGroup?: CookGroup;
  }>();
  const emit = defineEmits<{ closePopUp: []; refreshCookGroups: [] }>();

  const cookGroup = ref<CookGroup>(emptyCookGroup());
  const recipes = ref<Recipe[]>([]);
  const oldRecipes = ref<Recipe[]>([]);
  const errorMessage = ref<string>('');
  const searchRecipeQuery = ref<string>('');
  const filteredRecipes = ref<Recipe[]>([]);

  // Add cook group to edit if it exists
  onMounted(() => {
    if (props.cookGroup) {
      cookGroup.value = JSON.parse(JSON.stringify(props.cookGroup));
      cookGroup.value.name = cookGroup.value.name
        ? capitalize(cookGroup.value.name)
        : i18n.global.t('cookGroupsPage.personalCookGroup');
      cookGroup.value.invitees.push('');

      // Get cook group recipes if they exist
      getData('cookGroupRecipes', where('cookGroupId', '==', cookGroup.value.id))
        .then((cookGroupRecipe) => {
          // Get the recipe names
          Promise.all(
            (cookGroupRecipe as CookGroupRecipe[]).map((recipe) =>
              getData('recipes', where('id', '==', recipe.recipeId))
                .then((recipeData) => {
                  return (recipeData as Recipe[])[0] || emptyRecipe();
                })
                .catch((error) => {
                  console.error('Error getting recipe name for cook group recipe:', error);
                  return emptyRecipe();
                })
            )
          )
            .then((recipeNames) => {
              recipes.value = recipeNames;
              oldRecipes.value = JSON.parse(JSON.stringify(recipes.value));
              recipes.value.forEach((recipe) => {
                recipe.name = capitalizeFirstLetter(recipe.name);
              });
            })
            .catch((error) => {
              console.error('Error getting cook group recipes:', error);
            });
        })
        .catch((error) => {
          console.error('Error getting cook group recipes from database:', error);
        });
    }
  });

  // Watch for changes in the search query
  watch(searchRecipeQuery, (newQuery) => {
    if (newQuery.length > 2) {
      // Fetch recipes that the user has access to and match the search query
      getSearchRecipes(newQuery, getAuth().currentUser?.uid || '')
        .then((searchedRecipes) => {
          // Filter out recipes that are already in the cook group
          filteredRecipes.value = (searchedRecipes as Recipe[]).filter(
            (recipe: Recipe) => !recipes.value.some((groupRecipe) => groupRecipe.id === recipe.id)
          );

          // Set image for each recipe
          filteredRecipes.value.forEach((recipe_1) => {
            setImage(recipe_1.id, recipe_1.image);
          });
        })
        .catch((error) => {
          console.error('Error getting recipes for search query:', error);
        });
    }
  });

  /**
   * Add a recipe to the cook group
   * @param {Recipe} recipe - The recipe to add
   */
  function addRecipe(recipe: Recipe): void {
    // Check if the recipe is already in the cook group
    if (!recipes.value.some((groupRecipe) => groupRecipe.id === recipe.id)) {
      recipes.value.push({ ...recipe, name: capitalizeFirstLetter(recipe.name) });
      searchRecipeQuery.value = '';
      filteredRecipes.value = filteredRecipes.value.filter(
        (filteredRecipe) => filteredRecipe.id !== recipe.id
      );
    }
  }

  /**
   * Save the new cook group
   * @returns {Promise<void>} A promise that resolves when the cook group is saved
   */
  async function saveCookGroup(): Promise<void> {
    errorMessage.value = validateCookGroup(cookGroup.value);
    const invitees = cookGroup.value.invitees.filter((invitee) => invitee !== '');
    if (errorMessage.value === '') {
      if (!props.cookGroup) {
        cookGroup.value.id = crypto.randomUUID();
        cookGroup.value.owner = getAuth().currentUser?.uid || '';
        cookGroup.value.personal = false;
      }
      cookGroup.value.name = cookGroup.value.name.toLowerCase();
      cookGroup.value.invitees = [...new Set(invitees.map((invitee) => invitee.toLowerCase()))];

      // Save the cook group to the database
      let promise;
      if (props.cookGroup) {
        promise = updateData('cookGroups', where('id', '==', cookGroup.value.id), cookGroup.value);
      } else {
        promise = addData('cookGroups', cookGroup.value);
      }

      // Save the cook group recipes to the database
      let cookGroupRecipePromises: Promise<void>[] = [];

      // Add recipe to the cook group if it doesn't already exist
      const newRecipes = recipes.value.filter(
        (recipe) => !oldRecipes.value.some((oldRecipe) => oldRecipe.id === recipe.id)
      );

      if (newRecipes.length > 0) {
        cookGroupRecipePromises = newRecipes.map((recipe) => {
          const cookGroupRecipe: CookGroupRecipe = {
            id: crypto.randomUUID(),
            recipeId: recipe.id,
            cookGroupId: cookGroup.value.id,
            lastEaten: new Timestamp(0, 0)
          };
          return addData('cookGroupRecipes', cookGroupRecipe);
        });
      }

      // Remove recipes that are not in the new cook group
      const removedRecipes = oldRecipes.value.filter(
        (recipe) => !recipes.value.some((newRecipe) => newRecipe.id === recipe.id)
      );

      if (removedRecipes.length > 0) {
        const removePromises = removedRecipes.map((recipe) =>
          deleteData('cookGroupRecipes', {
            filters: and(
              where('recipeId', '==', recipe.id),
              where('cookGroupId', '==', cookGroup.value.id)
            ),
            constraints: []
          })
        );
        cookGroupRecipePromises.push(...removePromises);
      }

      promise
        .then(() => Promise.all(cookGroupRecipePromises))
        .then(() => {
          // Reset the form
          cookGroup.value = emptyCookGroup();
          errorMessage.value = '';

          // Emit the event to close the pop-up
          emit('refreshCookGroups');
          emit('closePopUp');
        })
        .catch((error) => {
          console.error('Error saving cook group to database:', error);
          errorMessage.value = i18n.global.t('editCookGroupPage.errors.save');
        });
    }
  }

  /**
   * Close the pop-up and reset the form
   */
  function closePopUp(): void {
    emit('closePopUp');
    cookGroup.value = emptyCookGroup();
    errorMessage.value = '';
  }

  return {
    cookGroup,
    recipes,
    errorMessage,
    searchRecipeQuery,
    filteredRecipes,
    addRecipe,
    saveCookGroup,
    closePopUp
  };
}
