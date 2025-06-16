<template>
  <main class="editRecipe">
    <article>
      <h2>{{ $t('editRecipePage.title') }}</h2>
      <form>
        <new-recipe
          v-model:recipe="recipe"
          v-model:cook-groups="cookGroups"
          v-model:cook-group-recipe="cookGroupRecipe"
          v-model:image="image"
          v-model:error-message="errorMessage"
        />
        <button @click.prevent="saveRecipe" id="save" type="submit">
          {{ $t('editRecipePage.save') }}
        </button>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import NewRecipe from '@/components/recipe/NewRecipe.vue';
import { useSecureRecipe } from '@/composables/useSecurity';
import i18n from '@/i18n/index';
import { getQueryCookGroups } from '@/utils/cook group/queryCookGroups';
import { sortCookGroups } from '@/utils/cook group/sort';
import { addData, deleteData, getData, updateData } from '@/utils/db';
import { deleteImage, uploadImage } from '@/utils/manageImage';
import { validateRecipe } from '@/utils/recipe/validateRecipe';
import { capitalizeFirstLetter } from '@/utils/text';
import {
  emptyCookGroupRecipe,
  type CookGroup,
  type CookGroupRecipe
} from '@/utils/types/cookgroup';
import type { Checkbox } from '@/utils/types/form';
import { emptyRecipe, type Recipe } from '@/utils/types/recipe';
import { getAuth } from 'firebase/auth';
import { and, Timestamp, where } from 'firebase/firestore';
import { ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import router from '@/router';

const auth = getAuth();
const route = useRoute();

// Recipe and cook group recipe
const oldRecipe = ref<Recipe>(emptyRecipe());
const recipe = ref<Recipe>(emptyRecipe());
const oldCookGroups = ref<Checkbox[]>([]);
const cookGroups = ref<Checkbox[]>([]);
const oldImage = ref<string>('');
const cookGroupRecipe = ref<CookGroupRecipe>(emptyCookGroupRecipe());

// Get the recipe from the database
watch(
  () => [route.params.cookGroupRecipeId],
  async () => {
    // Get the cook groups
    let userCookGroups = (await getData(
      'cookGroups',
      getQueryCookGroups(auth.currentUser?.uid || '')
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
    await useSecureRecipe(route.params.cookGroupRecipeId as string, cookGroupRecipe, recipe).then(
      async (result) => {
        if (result) {
          // Prepare the recipe for editing
          oldRecipe.value = recipe.value;
          recipe.value.name = capitalizeFirstLetter(recipe.value.name);
          oldImage.value = recipe.value.image;
        }
      }
    );

    // For each cook group, get cook group recipe that matches the recipe id
    try {
      const cookGroupRecipes = (await getData('cookGroupRecipes', {
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
      })) as CookGroupRecipe[];

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
      oldCookGroups.value = JSON.parse(JSON.stringify(cookGroups.value));
    } catch (error) {
      console.error(error);
    }
  },
  { immediate: true }
);

// Set the image to the recipe image
const image = ref<File | null>(null);
const errorMessage = ref<string>('');

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
    recipe.value.filterIngredients = recipe.value.ingredients.map((ingredient) => ingredient.name);

    // Clean or update the recipe
    if (oldRecipe.value == emptyRecipe()) {
      recipe.value.id = crypto.randomUUID();
      recipe.value.owner = auth.currentUser?.uid || '';
      recipe.value.image = image.value ? image.value.name : '';

      // Clean up the cook group recipe
      cookGroupRecipe.value.id = crypto.randomUUID();
      cookGroupRecipe.value.recipeId = recipe.value.id;
      cookGroupRecipe.value.cookGroupId = auth.currentUser?.uid || '';
      cookGroupRecipe.value.lastEaten = new Timestamp(0, 0);
    } else {
      if (image.value && image.value.name !== oldImage.value) {
        recipe.value.image = image.value.name;
      }
    }

    // Save the recipe
    try {
      // Check if the user is editing an existing recipe
      if (oldRecipe.value == emptyRecipe()) {
        await addData('recipes', recipe.value);
        await addData('cookGroupRecipes', cookGroupRecipe.value);

        // Save image
        if (image.value) {
          uploadImage(image.value);
        }
      } else {
        await updateData('recipes', where('id', '==', recipe.value.id), recipe.value);

        // Save image
        if (image.value && image.value.name !== oldImage.value) {
          uploadImage(image.value);
          deleteImage(oldImage.value);
        }
      }

      // Update non-personal cook groups
      cookGroups.value.forEach(async (cookGroup) => {
        if (cookGroup.name !== '') {
          const oldCookGroup = oldCookGroups.value.find((group) => group.id === cookGroup.id);
          if (cookGroup.checked && !oldCookGroup?.checked) {
            // Add cook group recipe
            await addData('cookGroupRecipes', {
              id: crypto.randomUUID(),
              recipeId: recipe.value.id,
              cookGroupId: cookGroup.id,
              lastEaten: new Timestamp(0, 0)
            });
          } else if (!cookGroup.checked && oldCookGroup?.checked) {
            // Remove cook group recipe
            await deleteData('cookGroupRecipes', {
              filters: and(
                ...[
                  where('recipeId', '==', recipe.value.id),
                  where('cookGroupId', '==', cookGroup.id)
                ]
              ),
              constraints: []
            });
          }
        }
      });

      // Reset the form
      recipe.value = emptyRecipe();
      oldRecipe.value = emptyRecipe();
      cookGroups.value = [];
      oldCookGroups.value = [];
      cookGroupRecipe.value = emptyCookGroupRecipe();
      image.value = null;
      oldImage.value = '';
      errorMessage.value = '';
      router.push({
        path: `/recipe/${route.params.cookGroupRecipeId}`
      });
    } catch (error) {
      console.error(error);
      errorMessage.value = i18n.global.t('editRecipePage.errors.save');
    }
  }
}

// Prevent leaving the page if there are unsaved changes
onBeforeRouteLeave(() => {
  if (
    (oldRecipe.value !== emptyRecipe() && recipe.value !== oldRecipe.value) ||
    recipe.value !== emptyRecipe()
  ) {
    const answer = window.confirm(i18n.global.t('editRecipePage.errors.unsavedChanges'));
    if (!answer) return false;
  }
});
</script>
