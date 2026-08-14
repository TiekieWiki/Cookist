<template>
  <section>
    <div>
      <h2>{{ recipeStore.recipe.name }}</h2>
      <div v-if="recipeStore.recipe.owner === userStore.user?.id">
        <Button :type="ButtonType.BUTTON" :icon-only="true" :variant="ColorVariant.TERTIARY">
          <font-awesome-icon
            @click="
              $router.push({
                path: `/edit-recipe/${recipeStore.recipe.id}`
              })
            "
            :icon="['fas', 'pen']"
          />
        </Button>
        <Button :type="ButtonType.BUTTON" :icon-only="true" :variant="ColorVariant.ERROR">
          <font-awesome-icon @click="deleteOpen = true" :icon="['fas', 'trash-can']" />
        </Button>
      </div>
    </div>
    <div>
      <p>{{ $t('editRecipePage.categories.' + recipeStore.recipe.category) }}</p>
      <p>|</p>
      <p><font-awesome-icon :icon="['far', 'clock']" /> {{ recipeStore.recipe.duration }}</p>
      <p>|</p>
      <p>
        <font-awesome-icon :icon="['fas', 'utensils']" />

        {{ recipeStore.recipe.portions }}
      </p>
      <template v-if="recipeStore.lastEatenRecipe">
        <p>|</p>
        <p>
          <font-awesome-icon :icon="['fas', 'calendar']" />
          {{ recipeStore.lastEatenRecipe }}
        </p>
      </template>
      <p>|</p>
      <div v-if="recipeStore.recipe.rating">
        <font-awesome-icon
          v-for="n in recipeStore.recipe.rating"
          :icon="['fas', 'star']"
          :key="n"
        />
        <font-awesome-icon
          v-for="n in 5 - recipeStore.recipe.rating!"
          :icon="['far', 'star']"
          :key="n"
        />
      </div>
    </div>
    <p v-if="recipeStore.recipe.notes">{{ recipeStore.recipe.notes }}</p>
  </section>
</template>

<script setup lang="ts">
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import { useRecipeStore } from '@/stores/useRecipeStore.js';
import { useUserStore } from '@/stores/useUserStore.js';

const userStore = useUserStore();
const recipeStore = useRecipeStore();

const deleteOpen = defineModel<boolean>('deleteOpen', { required: true });
</script>
