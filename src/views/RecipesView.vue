<template>
  <main class="recipes two-columns">
    <article>
      <section class="header">
        <h2>{{ $t('recipesPage.title') }}</h2>
        <select-field
          id="cookGroup"
          :ariaLabel="$t('recipesPage.ariaLabel.cookGroups')"
          :placeholder="$t('recipesPage.placeholder.cookGroups')"
          :required="false"
          :items="
            cookGroups.map((group) => ({
              value: group.id,
              label: capitalizeFirstLetter(group.name)
            }))
          "
          v-model:selected="selectedCookGroup"
        />
      </section>
      <recipe-order-filter v-model:filter="filter" v-model:order="order" />
    </article>
    <article v-if="recipes.length <= 0" class="noCards">
      <h3>{{ $t('recipesPage.noRecipes') }}</h3>
    </article>
    <transition-group v-else name="move">
      <article
        v-for="recipe in recipes"
        :key="recipe.id"
        class="card"
        :id="recipe.id"
        @click="
          $router.push({
            path: `/recipe/${currentCookGroupRecipes.find((group) => group.cookGroupId == selectedCookGroup && group.recipeId == recipe.id)?.id || ''}`
          })
        "
        tabindex="0"
      >
        <recipe-card
          :recipe="recipe"
          :current-cook-group-recipes="currentCookGroupRecipes"
          :selected-cook-group="selectedCookGroup"
        />
      </article>
    </transition-group>
    <article class="card newCard">
      <button
        @click="
          $router.push({
            path: '/edit-recipe'
          })
        "
        type="button"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>
    </article>
  </main>
</template>

<script setup lang="ts">
import { capitalizeFirstLetter } from '@/utils/global/text';
import SelectField from '@/components/form/SelectField.vue';
import RecipeCard from '@/components/recipe/RecipeCard.vue';
import RecipeOrderFilter from '@/components/recipe/RecipeOrderFilter.vue';
import { useRecipes } from '@/composables/useRecipes';

const { cookGroups, currentCookGroupRecipes, selectedCookGroup, recipes, order, filter } =
  useRecipes();
</script>
