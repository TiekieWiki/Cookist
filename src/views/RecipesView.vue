<template>
  <main>
    <RecipeOrderFilterCard />
    <RecipesCard />
    <article>
      <Button
        @click="
          $router.push({
            path: '/edit-recipe'
          })
        "
        :type="ButtonType.BUTTON"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
      </Button>
    </article>
  </main>
</template>

<script setup lang="ts">
import RecipeOrderFilterCard from '@/components/recipes/RecipeOrderFilterCard.vue';
import RecipesCard from '@/components/recipes/RecipesCard.vue';
import Button from '@/components/form/Button.vue';
import { ButtonType } from '@/utils/types/enums';
</script>
