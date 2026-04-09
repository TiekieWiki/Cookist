<template>
  <article>
    <section class="header">
      <h2>{{ capitalizeFirstLetter(recipe.name) }}</h2>
      <div v-if="recipe.owner === getAuth().currentUser?.uid" class="actions">
        <font-awesome-icon
          @click="
            $router.push({
              path: `/edit-recipe/${cookGroupRecipe.id}`
            })
          "
          class="edit"
          :icon="['fas', 'pen']"
        />
        <font-awesome-icon @click="deleteOpen = true" class="delete" :icon="['fas', 'trash-can']" />
      </div>
    </section>
    <section class="info">
      <p>{{ capitalizeFirstLetter($t('editRecipePage.categories.' + recipe.category)) }}</p>
      |
      <p><font-awesome-icon :icon="['far', 'clock']" /> {{ recipe.duration }}</p>
      |
      <p>
        <font-awesome-icon :icon="['fas', 'utensils']" />

        {{ recipe.portions }}
      </p>
      <template v-if="lastEaten">
        |
        <p>
          <font-awesome-icon :icon="['fas', 'calendar']" />
          {{ lastEaten }}
        </p>
      </template>
      |
      <div v-if="recipe.rating">
        <font-awesome-icon v-for="n in recipe.rating" :icon="['fas', 'star']" :key="n" />
        <font-awesome-icon v-for="n in 5 - recipe.rating!" :icon="['far', 'star']" :key="n" />
      </div>
    </section>
    <p v-if="recipe.notes">{{ recipe.notes }}</p>
  </article>
</template>

<script setup lang="ts">
import { useRecipe } from '@/composables/useRecipe';
import { getAuth } from 'firebase/auth';
import { capitalizeFirstLetter } from '@/utils/global/text';

const deleteOpen = defineModel<boolean>('deleteOpen', { required: true });

const { recipe, cookGroupRecipe, lastEaten } = useRecipe();
</script>
