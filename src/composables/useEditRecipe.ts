import i18n from '@/i18n';
import { queryCookGroups } from '@/utils/cook group/getCookGroups';
import { sortCookGroups } from '@/utils/cook group/sortCookGroup';
import { addData, deleteData, getData, updateData } from '@/utils/global/db';
import { capitalizeFirstLetter } from '@/utils/global/text';
import {
  emptyCookGroupRecipe,
  type CookGroup,
  type CookGroupRecipe
} from '@/utils/types/cookgroup';
import type { Checkbox } from '@/utils/types/form';
import { getAuth } from 'firebase/auth';
import { ref, watch, type Ref } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { useSecureRecipe } from './useSecurity';
import { and, Timestamp, where } from 'firebase/firestore';
import { emptyRecipe, type Recipe } from '@/utils/types/recipe';
import router from '@/router';
import { uploadImage, deleteImage } from '@/utils/global/manageImage';
import { validateRecipe } from '@/utils/recipe/validateRecipe';

/**
 * Composable for editing a recipe
 * @returns {Object} An object containing the recipe, cook groups, cook group recipe, image, error message, and a function to save the recipe
 */
export function useEditRecipe(): {
  recipe: Ref<Recipe>;
  cookGroups: Ref<Checkbox[]>;
  cookGroupRecipe: Ref<CookGroupRecipe>;
  image: Ref<File | null>;
  errorMessage: Ref<string>;
  saveRecipe: () => Promise<void>;
} {
  const route = useRoute();

  const oldRecipe = ref<Recipe>(emptyRecipe());
  const recipe = ref<Recipe>(emptyRecipe());
  let oldCookGroups: Checkbox[] = [];
  const cookGroups = ref<Checkbox[]>([]);
  let oldImage: string = '';
  const cookGroupRecipe = ref<CookGroupRecipe>(emptyCookGroupRecipe());
  const image = ref<File | null>(null);
  const errorMessage = ref<string>('');

  // Get the recipe from the database
  watch(
    () => [route.params.cookGroupRecipeId],
    async () => {
      // Get the cook groups
      let userCookGroups = (await getData(
        'cookGroups',
        queryCookGroups(getAuth().currentUser?.uid || '')
      )) as CookGroup[];
      userCookGroups = sortCookGroups(userCookGroups);

      // For each cook group, create a checkbox
      cookGroups.value = userCookGroups.map((cookGroup) => ({
        id: cookGroup.id,
        name: cookGroup.name,
        label: cookGroup.personal
          ? i18n.global.t('cookGroupsPage.personalCookGroup')
          : capitalizeFirstLetter(cookGroup.name),
        required: false,
        disabled: cookGroup.personal,
        autocomplete: 'off',
        checked: cookGroup.personal
      })) as Checkbox[];

      // Check if the recipe needs to be edited or added
      if (!route.params.cookGroupRecipeId) return;

      // Get the recipe if user has access to it
      useSecureRecipe(route.params.cookGroupRecipeId as string, cookGroupRecipe, recipe).then(
        async (result) => {
          if (result) {
            // Prepare the recipe for editing
            oldRecipe.value = recipe.value;
            recipe.value.name = capitalizeFirstLetter(recipe.value.name);
            oldImage = recipe.value.image;
          }
        }
      );

      // For each cook group, get cook group recipe that matches the recipe id
      getData('cookGroupRecipes', {
        filters: and(
          ...[
            where('recipeId', '==', recipe.value.id),
            where(
              'cookGroupId',
              'in',
              cookGroups.value.map((group) => group.id)
            )
          ]
        ),
        constraints: []
      })
        .then((cookGroupRecipes) => {
          // If the cook group recipe exists, turn on the checkbox
          if (cookGroupRecipes.length > 0) {
            cookGroupRecipes.forEach((cookGroupRecipe) => {
              const index = cookGroups.value.findIndex(
                (group) => group.id === cookGroupRecipe.cookGroupId
              );
              if (index !== -1) {
                cookGroups.value[index].checked = true;
              }
            });
          }
          oldCookGroups = JSON.parse(JSON.stringify(cookGroups.value));
        })
        .catch((error) => {
          console.error('Error setting cook groups:', error);
        });
    },
    { immediate: true }
  );

  /**
   * Save the recipe
   * @returns {Promise<void>} A promise that resolves when the recipe is saved
   */
  async function saveRecipe(): Promise<void> {
    errorMessage.value = validateRecipe(recipe.value);
    if (errorMessage.value === '') {
      // Clean up the recipe
      recipe.value.name = recipe.value.name.toLowerCase();
      recipe.value.ingredients = recipe.value.ingredients.filter(
        (ingredient) => ingredient.amount !== 0 && ingredient.unit !== '' && ingredient.name !== ''
      );
      recipe.value.ingredients = recipe.value.ingredients.map((ingredient) => ({
        amount: ingredient.amount,
        unit: ingredient.unit,
        name: ingredient.name.toLowerCase()
      }));
      recipe.value.instructions = recipe.value.instructions.filter(
        (instruction) => instruction !== ''
      );
      recipe.value.instructions = recipe.value.instructions.map((instruction) =>
        instruction.toLowerCase()
      );
      recipe.value.filterIngredients = recipe.value.ingredients.map(
        (ingredient) => ingredient.name
      );

      // Clean or update the recipe
      if (JSON.stringify(oldRecipe.value) == JSON.stringify(emptyRecipe())) {
        recipe.value.id = crypto.randomUUID();
        recipe.value.owner = getAuth().currentUser?.uid || '';
        recipe.value.image = image.value ? image.value.name : '';
      } else {
        if (image.value && image.value.name !== oldImage) {
          recipe.value.image = image.value.name;
        }
      }

      // Save the recipe
      let savePromise: Promise<void>;
      let cookGroupRecipeId = '';

      if (JSON.stringify(oldRecipe.value) == JSON.stringify(emptyRecipe())) {
        // Adding a new recipe
        savePromise = addData('recipes', recipe.value).then(() => {
          if (image.value) {
            uploadImage(image.value);
          }
        });
      } else {
        // Updating an existing recipe
        savePromise = updateData('recipes', where('id', '==', recipe.value.id), recipe.value).then(
          () => {
            if (image.value && image.value.name !== oldImage) {
              uploadImage(image.value);
              deleteImage(oldImage);
            }
          }
        );
      }

      return savePromise
        .then(() => {
          // Handle updates to non-personal cook groups
          const updatePromises = cookGroups.value.map((cookGroup) => {
            if (cookGroup.name === '') return Promise.resolve();

            const oldCookGroup = oldCookGroups.find((group) => group.id === cookGroup.id);

            if (cookGroup.checked && !oldCookGroup?.checked) {
              // Add cook group recipe
              cookGroupRecipeId = crypto.randomUUID();
              return addData('cookGroupRecipes', {
                id: cookGroupRecipeId,
                recipeId: recipe.value.id,
                cookGroupId: cookGroup.id,
                lastEaten: new Timestamp(0, 0)
              });
            } else if (!cookGroup.checked && oldCookGroup?.checked) {
              // Remove cook group recipe
              return deleteData('cookGroupRecipes', {
                filters: and(
                  where('recipeId', '==', recipe.value.id),
                  where('cookGroupId', '==', cookGroup.id)
                ),
                constraints: []
              });
            }

            return Promise.resolve();
          });

          return Promise.all(updatePromises);
        })
        .then(() => {
          // Reset the form
          recipe.value = emptyRecipe();
          oldRecipe.value = emptyRecipe();
          cookGroups.value = [];
          oldCookGroups = [];
          cookGroupRecipe.value = emptyCookGroupRecipe();
          image.value = null;
          oldImage = '';
          errorMessage.value = '';

          router.push({
            path: `/recipe/${route.params.cookGroupRecipeId || cookGroupRecipeId}`
          });
        })
        .catch((error) => {
          console.error('Error saving recipe:', error);
          errorMessage.value = i18n.global.t('editRecipePage.errors.save');
        });
    }
  }

  // Prevent leaving the page if there are unsaved changes
  onBeforeRouteLeave(() => {
    if (
      (JSON.stringify(oldRecipe.value) !== JSON.stringify(emptyRecipe()) &&
        recipe.value !== oldRecipe.value) ||
      JSON.stringify(recipe.value) !== JSON.stringify(emptyRecipe())
    ) {
      const answer = window.confirm(i18n.global.t('editRecipePage.errors.unsavedChanges'));
      if (!answer) return false;
    }
  });

  return { recipe, cookGroups, cookGroupRecipe, image, errorMessage, saveRecipe };
}
