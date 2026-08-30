<template>
  <section class="header">
    <img :src="recipeStore.recipeImage" />
    <div class="title">
      <div>
        <h2>{{ recipeStore.recipe.name }}</h2>
        <p v-if="recipeStore.recipe.notes">{{ recipeStore.recipe.notes }}</p>
      </div>
      <div v-if="recipeStore.recipe.owner === userStore.user?.id" class="actions">
        <Button
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.SECONDARY"
          @click="
            $router.push({
              path: `/edit-recipe/${recipeStore.recipe.id}`
            })
          "
        >
          <font-awesome-icon :icon="['fas', 'pen']" />
          {{ $t('recipePage.edit') }}
        </Button>
        <Button :type="ButtonType.BUTTON" :variant="ColorVariant.WARNING">
          <font-awesome-icon @click="deleteOpen = true" :icon="['fas', 'trash-can']" />
          {{ $t('recipePage.delete') }}
        </Button>
      </div>
    </div>
    <div class="info">
      <p>
        <font-awesome-icon :icon="['far', 'clock']" /> {{ recipeStore.recipe.duration }}
        {{ $t('recipePage.minutes') }}
      </p>
      <p>
        <font-awesome-icon :icon="['fas', 'user-group']" />

        {{ recipeStore.recipe.portions }} {{ $t('recipePage.servings') }}
      </p>
      <p>
        <font-awesome-icon :icon="['fas', 'bowl-food']" />
        {{ $t('editRecipePage.categories.' + recipeStore.recipe.category) }}
      </p>
      <p v-if="recipeStore.recipe.rating">
        <font-awesome-icon :icon="['fas', 'star']" />
        {{ recipeStore.recipe.rating }} {{ $t('recipePage.rating') }}
      </p>
    </div>
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
