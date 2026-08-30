<template>
  <section class="lastEaten card">
    <p>{{ $t('recipePage.lastCooked') }}</p>
    <h3>
      {{ recipeStore.lastEatenRecipe ? recipeStore.lastEatenRecipe : $t('recipePage.neverCooked') }}
    </h3>
    <Button
      @click="recipeStore.setLastEaten"
      :disabled="lastEatenToday"
      :type="ButtonType.BUTTON"
      :variant="ColorVariant.PRIMARY"
    >
      {{ $t('recipePage.eatenToday') }}
    </Button>
  </section>
</template>

<script setup lang="ts">
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import { computed } from 'vue';
import { useRecipeStore } from '@/stores/useRecipeStore.js';
import { isToday } from '@/utils/global/date.js';

const recipeStore = useRecipeStore();

const lastEatenToday = computed(() => {
  return isToday(recipeStore.lastEatenRecipe);
});
</script>
