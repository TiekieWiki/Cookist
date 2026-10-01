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
      <RecipeGrid :recipes="forgottenRecipes" />
    </section>
  </article>
</template>

<script setup lang="ts">
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import Button from '@/components/form/Button.vue';
import { onMounted, ref } from 'vue';
import type { RecipeSummary } from '@/utils/types/recipe.ts';
import { getForgottenRecipes } from '@/utils/home/forgottenRecipes.ts';
import RecipeGrid from '../recipes/RecipeGrid.vue';

const forgottenRecipes = ref<RecipeSummary[]>([]);

onMounted(async () => {
  forgottenRecipes.value = await getForgottenRecipes();
});
</script>
