<template>
  <article v-if="forgottenRecipes.length === 3" class="forgottenRecipes">
    <section class="title">
      <div>
        <h2>{{ $t('homePage.forgottenRecipes.title') }}</h2>
        <p>{{ $t('homePage.forgottenRecipes.subtitle') }}</p>
      </div>
      <div class="actions">
        <router-link to="/recipes" tabindex="-1">
          <Button :type="ButtonType.BUTTON" :variant="ColorVariant.TERTIARY" :size="Size.LARGE">
            {{ $t('homePage.forgottenRecipes.allRecipes') }}</Button
          ></router-link
        >
      </div>
    </section>
    <section class="recipesList">
      <router-link
        v-for="recipe in forgottenRecipes"
        :key="recipe.id"
        :id="recipe.id"
        :to="`/recipe/${recipe.id}`"
        tabindex="0"
      >
        <div class="grid">
          <RecipeCard :recipe="recipe" />
        </div>
      </router-link>
    </section>
  </article>
</template>

<script setup lang="ts">
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import Button from '../form/Button.vue';
import { onMounted, ref } from 'vue';
import type { Recipe } from '@/utils/types/recipe.ts';
import { getForgottenRecipes } from '@/utils/home/forgottenRecipes.ts';
import RecipeCard from '../recipes/RecipeCard.vue';

const forgottenRecipes = ref<Recipe[]>([]);

onMounted(async () => {
  forgottenRecipes.value = await getForgottenRecipes();
});
</script>
