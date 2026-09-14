<template>
  <section class="recipeCard">
    <div class="image">
      <img :src="recipeImage" />
      <Pill :variant="ColorVariant.SECONDARY" :size="Size.MEDIUM">
        {{ lastEaten ? lastEaten : $t('recipePage.neverCooked') }}
      </Pill>
    </div>
    <div class="content">
      <h3>{{ recipe.name }}</h3>
      <p v-if="recipe.notes">{{ recipe.notes }}</p>
      <div class="info">
        <p class="small">
          <font-awesome-icon :icon="['far', 'clock']" /> {{ recipe.duration }}
          {{ $t('recipePage.minutes') }}
        </p>
        <p class="small">
          <font-awesome-icon :icon="['fas', 'user-group']" />

          {{ recipe.portions }}
        </p>
        <p class="small">
          <font-awesome-icon :icon="['fas', 'bowl-food']" />
          {{ $t('editRecipePage.categories.' + recipe.category) }}
        </p>
        <p v-if="recipeStore.recipe.rating" class="small">
          <font-awesome-icon :icon="['fas', 'star']" />
          {{ recipeStore.recipe.rating }}
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Recipe } from '@/utils/types/recipe';
import { formatDateAgo } from '@/utils/global/date';
import { computed, onMounted, ref } from 'vue';
import { useRecipeStore } from '@/stores/useRecipeStore';
import Pill from '@/components/general/Pill.vue';
import { ColorVariant, Size } from '@/utils/types/enums';

const props = defineProps<{
  recipe: Recipe;
}>();

const recipeStore = useRecipeStore();

const lastEaten = computed(() => formatDateAgo(props.recipe.last_eaten ?? null));
const recipeImage = ref<string>('');

onMounted(async () => {
  if (props.recipe.id) {
    recipeImage.value = await recipeStore.getRecipeImage(props.recipe.id);
  }
});
</script>
