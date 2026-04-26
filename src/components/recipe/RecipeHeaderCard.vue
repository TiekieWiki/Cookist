<template>
  <article class="card accent">
    <section class="header">
      <h2>{{ capitalizeFirstLetter(recipe.name) }}</h2>
      <div v-if="recipe.owner === getAuth().currentUser?.uid" class="actions">
        <Button :type="ButtonType.BUTTON" :icon-only="true" :variant="ColorVariant.TERTIARY">
          <font-awesome-icon
            @click="
              $router.push({
                path: `/edit-recipe/${cookGroupRecipe.id}`
              })
            "
            :icon="['fas', 'pen']"
          />
        </Button>
        <Button :type="ButtonType.BUTTON" :icon-only="true" :variant="ColorVariant.WARNING">
          <font-awesome-icon @click="deleteOpen = true" :icon="['fas', 'trash-can']" />
        </Button>
      </div>
    </section>
    <section class="actions wrap">
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
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';

const deleteOpen = defineModel<boolean>('deleteOpen', { required: true });

const { recipe, cookGroupRecipe, lastEaten } = useRecipe();
</script>
